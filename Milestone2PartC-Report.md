# Milestone 2 Part C: Documents

## Question 1 — User story and MVP

### Which types play each key role (model, view, presenter)? How are they related, and how do they avoid breaking the dependency rule?

**Model:** The “model” for the user story is the source of status data. In our design this is represented by:
- **FakeData** (or a future **StatusService** / server API) that provides `getPageOfStatuses(...)`. The **StoryPresenter** calls into this to load items. The UI does not depend on the model directly; only the presenter does.

**View:** The view is everything that displays data and forwards user actions:
- **StoryScroller** (React component) — entry for the story screen.
- **ItemScroller** (React component) — generic scroller that holds **PagedItemView** state (items, hasMoreItems, lastItem) and renders the list.
- **StatusItem** (React component) — renders a single status.
- **PagedItemView\<Status\>** (interface) — implemented by the object that ItemScroller builds and passes to the presenter (`addItems`, `setHasMoreItems`, `setLastItem`, `getLastItem`, `displayErrorMessage`, `displayInfoMessage`, `clearInfoMessage`).

**Presenter:** The presenter owns the story-loading workflow and talks to both model and view:
- **StoryPresenter** (class) — extends **PagedItemPresenter\<Status\>**. It receives a **PagedItemView\<Status\>** and implements `getLoadMoreItems(...)` by calling FakeData (model). It calls the view’s `addItems`, `setHasMoreItems`, `setLastItem`, and error/info message methods.

**Relationships and dependency rule:**
- **StoryScroller** creates an **ItemScroller** and passes a `presenterGenerator` that, given a view, returns a **StoryPresenter**.
- **ItemScroller** builds the **PagedItemView** (model of the list state), creates the presenter via `presenterGenerator(view)`, and calls `presenter.loadMoreItems(...)` when more data is needed.
- **StoryPresenter** depends on the **PagedItemView** interface and on the model (FakeData / service). The view and the React components do not depend on the presenter’s class or the model; they depend only on interfaces/callbacks. So high-level modules (view/UI) do not depend on low-level modules (model); both depend on abstractions (view interface, service interface), satisfying the dependency rule.

---

### Two or three reasons why MVP is effective for this design

1. **Testability:** Presenters (e.g. **StoryPresenter**, **AppNavbarPresenter**, **PostStatusPresenter**) depend only on view and service interfaces. We can test them with mocked views and services (e.g. ts-mockito) and verify the correct sequence of view calls and service calls without rendering React or hitting the server.

2. **Separation of concerns:** The view (ItemScroller + StatusItem) only renders what it is told and notifies the presenter when more items are needed. The presenter decides *when* to load, *from where* (model/service), and *what* to tell the view (add items, set hasMore, show error). Business and navigation logic stay out of the React components.

3. **Reuse and consistency:** **PagedItemPresenter** and **ItemScroller** are shared by Story, Feed, Followers, and Followees. The same “load more” flow and view contract apply everywhere; only the concrete presenter and item type (Status vs User) and the model call (e.g. `getPageOfStatuses` vs `getPageOfUsers`) differ.

---

### UML class diagram (user story / MVP)

```
+------------------+       +---------------------------+       +----------------------+
|   StoryScroller  |       | PagedItemView<Status>      |       |   StoryPresenter     |
|   (React comp)   |------>| (interface)               |<------|   (Presenter)        |
+------------------+       | + addItems(Status[])       |       +----------------------+
        |                  | + setHasMoreItems(bool)   |                 |
        |                  | + setLastItem(Status|null) |                 |
        |                  | + getLastItem(): Status|null|                 |
        |                  | + displayErrorMessage(str)|                 |
        |                  | + displayInfoMessage(...)  |                 |
        |                  | + clearInfoMessage()       |                 |
        |                  +---------------------------+                 |
        |                              ^                                 |
        |                              | implements                      |
        |                  +-----------+-----------+                     |
        |                  |     ItemScroller     |                     |
        v                  | (builds view object, |                     |
+------------------+       |  uses presenter)     |                     v
|   StatusItem     |       +----------------------+            +------------------+
| (React comp)     |                                          | FakeData /       |
| + status: Status |                                          | StatusService    |
+------------------+                                          | (model)          |
                                                              +------------------+
```

---

### UML sequence diagram (user story — loading more items)

```
User          ItemScroller       StoryPresenter    PagedItemView    Model (FakeData)
 |                  |                    |                |                    |
 |  scroll (more)   |                    |                |                    |
 |----------------->|                    |                |                    |
 |                  | loadMoreItems()    |                |                    |
 |                  |------------------->|                |                    |
 |                  |                    | getLastItem()  |                    |
 |                  |                    |--------------->|                    |
 |                  |                    |                |                    |
 |                  |                    | getLoadMoreItems()                   |
 |                  |                    |------------------------------------->|
 |                  |                    |   [Status[], bool]                   |
 |                  |                    |<-------------------------------------|
 |                  |                    | addItems()      |                    |
 |                  |                    |--------------->|                    |
 |                  |                    | setHasMoreItems()                    |
 |                  |                    |--------------->|                    |
 |                  |                    | setLastItem()   |                    |
 |                  |                    |--------------->|                    |
 |                  |  (re-render list)  |                |                    |
 |<-----------------|                    |                |                    |
```

---

## Question 2 — Template method pattern

### A. Which classes play each key role? Relationship and behavior (superclass vs subclasses)

**Abstract template class:** **PagedItemPresenter\<T\>**
- Defines the **template method**: `loadMoreItems(authToken, userAlias, pageSize)`. It gets `lastItem` from the view, calls the abstract **primitive** `getLoadMoreItems(authToken, userAlias, pageSize, lastItem)`, then updates the view with the result (`setHasMoreItems`, `setLastItem`, `addItems`). Failure is handled in one place via `doFailureReportingOperation` (displays error on the view).
- Defines the **primitive operation**: abstract `getLoadMoreItems(...): Promise<[T[], boolean]>` — no default behavior; each subclass implements it.

**Concrete subclasses:** **StoryPresenter**, **FeedPresenter**, **FollowersPresenter**, **FolloweesPresenter**
- Each extends **PagedItemPresenter** with a specific type (**Status** or **User**).
- Each implements **only** `getLoadMoreItems(...)` by calling the appropriate model (e.g. FakeData for statuses or users). They do not duplicate the “get last item, call load, update view, handle errors” flow.

**Relationship:** The abstract class owns the algorithm; subclasses plug in the data-fetch step. The view is **PagedItemView\<T\>**, used by the template method to read/write list state.

---

### B. How the template method reduced duplication (with reference to the diagrams)

**Before:** Each feature (Story, Feed, Followers, Followees) would have had its own presenter with repeated logic: get `lastItem` from the view, call the service/FakeData, then `setHasMoreItems`, `setLastItem`, `addItems`, and the same error handling. Only the actual “fetch” call (and item type) differed.

**After:** That repeated logic lives once in **PagedItemPresenter.loadMoreItems**. Subclasses only implement `getLoadMoreItems`, which returns the next page and a “has more” flag. So we removed duplicated control flow and error handling and kept a single place to change pagination or error behavior.

---

### UML class diagram — Before template method

```
+------------------+     +------------------+     +------------------+     +------------------+
| StoryPresenter    |     | FeedPresenter     |     | FollowersPresent. |     | FolloweesPresent. |
| (duplicate logic) |     | (duplicate logic)|     | (duplicate logic) |     | (duplicate logic) |
+------------------+     +------------------+     +------------------+     +------------------+
| loadMoreItems()   |     | loadMoreItems()  |     | loadMoreItems()   |     | loadMoreItems()   |
| get lastItem,     |     | get lastItem,    |     | get lastItem,     |     | get lastItem,     |
| call FakeData,    |     | call FakeData,   |     | call FakeData,    |     | call FakeData,    |
| update view,      |     | update view,     |     | update view,      |     | update view,      |
| handle errors     |     | handle errors    |     | handle errors     |     | handle errors     |
+------------------+     +------------------+     +------------------+     +------------------+
        |                         |                         |                         |
        v                         v                         v                         v
   FakeData (statuses)      FakeData (statuses)      FakeData (users)        FakeData (users)
```

*(Same algorithm and view updates repeated in four presenters.)*

---

### UML class diagram — After template method

```
                    +---------------------------+
                    | PagedItemPresenter<T>     |
                    | (abstract)                |
                    +---------------------------+
                    | + loadMoreItems(...)      |  <- template method: get lastItem, call
                    |   [uses getLoadMoreItems] |     getLoadMoreItems, update view, handle errors
                    | # getLoadMoreItems(...)   |  <- abstract primitive
                    |   : Promise<[T[], bool]>  |
                    +-------------+------------+
                                  ^
          +-----------------------+-----------------------+
          |                       |                       |
+------------------+    +------------------+    +------------------+    +------------------+
| StoryPresenter   |    | FeedPresenter    |    | FollowersPresent. |    | FolloweesPresent. |
| extends Paged..  |    | extends Paged..   |    | extends Paged..   |    | extends Paged..   |
+------------------+    +------------------+    +------------------+    +------------------+
| # getLoadMoreItems|   | # getLoadMoreItems|   | # getLoadMoreItems |   | # getLoadMoreItems|
|   -> FakeData     |   |   -> FakeData     |   |   -> FakeData      |   |   -> FakeData     |
|   getPageOfStatuses|  |   getPageOfStatuses|  |   getPageOfUsers   |   |   getPageOfUsers   |
+------------------+    +------------------+    +------------------+    +------------------+
```

*(Single algorithm in the superclass; subclasses only implement the data-fetch step.)*

---

**Submission reminder:** Submit a zip of your project and a PDF of this report (with the diagrams) to Canvas.
