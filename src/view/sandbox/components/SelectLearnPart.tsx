import { Select } from '@chakra-ui/react';

interface SelectLearnPartProps {
  partRange: number;
  totalSentence: number;
  currentPart: number;
  onChangeVideoPart: (startSentence: number, endSentence: number) => void;
}

const SelectLearnPart = ({
  partRange,
  totalSentence,
  currentPart,
  onChangeVideoPart,
}: SelectLearnPartProps) => {
  const handleSelectPart = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const startSentence = +(selectedOption.getAttribute('data-start-sentence') ?? 0);
    const endSentence = +(selectedOption.getAttribute('data-end-sentence') ?? 0);

    onChangeVideoPart(startSentence, endSentence);
  };

  const numberOptions = Math.ceil(totalSentence / partRange);
  const optionParts = Array.from({ length: numberOptions }, (_, index) => index);

  return (
    <Select placeholder="Select video part" value={currentPart} onChange={handleSelectPart}>
      {optionParts.map((partIndex) => {
        const startSentence = partIndex * partRange;
        const endSentence = (partIndex + 1) * partRange - 1;
        const limitedEndSentence = Math.min(totalSentence - 1, endSentence);

        return (
          <option
            key={partIndex}
            value={partIndex}
            data-start-sentence={startSentence}
            data-end-sentence={limitedEndSentence}
          >{`Part ${partIndex + 1} (${startSentence + 1} - ${limitedEndSentence + 1})`}</option>
        );
      })}
    </Select>
  );
};

export default SelectLearnPart;
