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

  console.log("DBExplorer:", tabIndex, selectedOption)

  return (<>
    {/* <ScaleFade initialScale={0.5} in={tabIndex === 1}> */}
      {/* {selectedOption === 0 && (
        <ScaleFade initialScale={0.5} in={selectedOption === 0}>
          <SavedDataWidget tabIndex={0} />
        </ScaleFade>
      )} */}
      {selectedOption === 1 && (
        // <ScaleFade initialScale={0.5} in={selectedOption === 1}>
          <HistoryWidget tabIndex={1} />
        // </ScaleFade>
      )}
     {/* </ScaleFade> */}
    </>
  );
};

export default DBExplorer;
