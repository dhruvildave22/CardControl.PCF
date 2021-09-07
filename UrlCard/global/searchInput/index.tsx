/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Tag, Input, Tooltip } from 'antd';
import PropTypes from 'prop-types';

const SearchInput = ({
  tags, inputValue, setInputValue, setIsLoading, setTags, setSearchData, setIsCall,
}: any) => {
  const [isEdit, setIsedit] = React.useState(false);
  const [inputVisible, setInputVisible] = React.useState(false);
  const inputEl: any = React.createRef();

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputFocus = () => {
    if (tags.length !== 0) {
      setInputValue(tags[0]);
      setIsedit(true);
    }
  };

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = (e: any) => {
    setIsLoading(true);
    if (e.target.value !== '') {
      let newTag = [...tags];
      if (inputValue && tags.indexOf(inputValue) === -1) {
        newTag = [inputValue];
      }
      setTags(newTag);
      setInputVisible(false);
      setInputValue('');
      setIsedit(false);
    } else {
      setTags([]);
      setSearchData([]);
      setIsLoading(false);
      setIsCall(false);
    }
  };

  const handleClose = (removedTag: any) => {
    const removedTags = tags.filter((tag:any) => tag !== removedTag);
    setTags(removedTags);
    if (removedTags.length === 0) {
      setSearchData([]);
      setIsLoading(false);
      setIsCall(false);
    }
  };

  React.useEffect(() => {
    if (inputVisible) {
      inputEl.current.focus();
    }
  }, [inputVisible]);

  return (
    <div className="search-video">
      <SearchOutlined style={{ color: 'gray', fontSize: 22 }} />
      {!isEdit && tags.map((tag: any) => {
        const isLongTag = tag.length > 20;

        const tagElem = (
          <Tag
            className="edit-tag"
            key={tag}
            closable
            onClose={() => handleClose(tag)}
          >
            <span>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input
          ref={inputEl}
          type="text"
          size="small"
          className="tag-input"
          value={inputValue}
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      <div className="input-placeholder" onClick={() => (!inputVisible ? showInput() : null)} />
    </div>
  );
};

// SearchInput.propTypes = {
//   tags: PropTypes.arrayOf(PropTypes.string).isRequired,
//   inputValue: PropTypes.string.isRequired,
//   setIsLoading: PropTypes.func.isRequired,
//   setTags: PropTypes.func.isRequired,
//   setSearchData: PropTypes.func.isRequired,
//   setIsCall: PropTypes.func.isRequired,
// };

export default SearchInput;
