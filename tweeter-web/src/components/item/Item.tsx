import { Link } from "react-router-dom";

interface Props<T> {
  item: T;
  featurePath: string;
  navigateToUser?: (event: React.MouseEvent) => void;
  itemComponentGenerator: (item: T) => JSX.Element;
}

/**
 * Generic Item component that replaces both StatusItem and UserItem.
 * Demonstrates:
 * - Generic types (T parameter)
 * - Composition (delegates rendering to itemComponentGenerator function)
 * - Function as parameter (itemComponentGenerator)
 */
function Item<T>(props: Props<T>) {
  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        {props.itemComponentGenerator(props.item)}
      </div>
    </div>
  );
}

export default Item;
