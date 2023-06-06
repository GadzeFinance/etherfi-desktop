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
          <SavedDataWidget tabIndex={tabIndex} selectedOption={selectedOption} />
      )}
      { selectedOption === 1 && (
          <HistoryWidget tabIndex={tabIndex} selectedOption={selectedOption}/>
      )}
    </>
  );
};

export default DBExplorer;
