import HistoryWidget from './HistoryWidget'
import SavedDataWidget from './SavedDataWidget'

interface DBExplorerProps {
  password: string
  tabIndex: number
  selectedOption: number
}

const DBExplorer = ({
  password,
  tabIndex,
  selectedOption
}: DBExplorerProps) => {

  return (<>
      { selectedOption === 0 && (
          <SavedDataWidget tabIndex={0} />
      )}
      { selectedOption === 1 && (
          <HistoryWidget tabIndex={1} />
      )}
    </>
  );
};

export default DBExplorer;
