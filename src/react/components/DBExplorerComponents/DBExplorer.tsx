import { ScaleFade } from '@chakra-ui/react'
import HistoryWidget from './HistoryWidget'
import SavedDataWidget from './SavedDataWidget'

interface DBExplorerProps {
  password: string
  tabIndex: number
  selectedOption: number
}

const DBDropDownOptions = {
  "Saved Mnemonics & Validator keys": 0,
  "Staker History": 1
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
