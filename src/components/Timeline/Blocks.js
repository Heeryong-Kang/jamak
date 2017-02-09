import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import Block from '../Block/Block';
import styles from './styles.css';

const Blocks = (props) => {
  const {
    blocks,
    duration,
    currentBlockId,
    selectedBlockId,
    currentBlock,
    selectBlock,
  } = props;
  return (
    <div styleName="line">
      {blocks.map((block) =>
        <Block
          key={block.id}
          id={block.id}
          duration={duration}
          startTime={block.startTime}
          endTime={block.endTime}
          subtitle={block.subtitle}
          current={currentBlockId === block.id}
          selected={selectedBlockId === block.id}
          onCurrentBlock={currentBlock}
          onSelectBlock={selectBlock} />,
      )}
    </div>
  );
};

Blocks.propTypes = {
  blocks: PropTypes.array.isRequired,
  duration: PropTypes.number.isRequired,
  currentBlockId: PropTypes.number.isRequired,
  selectedBlockId: PropTypes.number.isRequired,
  currentBlock: PropTypes.func.isRequired,
  selectBlock: PropTypes.func.isRequired,
};

export default CSSModules(Blocks, styles);