import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/dist/client/router';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(SEARCH_PRODUCTS_QUERY, {
    variables: { searchTerm: '' },
    fetchPolicy: 'no-cache',
  });
  const items = data?.allProducts || [];
  resetIdCounter();

  const [isOpen, setIsOpen] = useState(false);

  const handleInputValueChange = debounce(({ inputValue }) => {}, 350);

  const handleSelectedItemChange = ({ selectedItem }) => {
    setIsOpen(false);
    router.push({
      pathname: `/product/${selectedItem.id}`,
    });
  };

  const getItemLabel = (item) => item?.name || '';

  const {
    inputValue,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    onInputValueChange: handleInputValueChange,
    onSelectedItemChange: handleSelectedItemChange,
    itemToString: getItemLabel,
    onToggleMenu: ({ isOpen }) => setIsOpen(isOpen),
  });

  React.useEffect(() => {
    if (inputValue.trim() !== '') {
      refetch({ searchTerm: inputValue });
    }
  }, [inputValue, refetch]);

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an Item',
            id: 'search',
            className: loading ? 'loading' : null,
            'aria-label': 'Search',
            onChange: (e) =>
              handleInputValueChange({ inputValue: e.target.value }),
            onFocus: () => setIsOpen(true),
            onBlur: () => setIsOpen(false),
          })}
        />
      </div>
      <DropDown {...getMenuProps()} aria-labelledby="search">
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              {...getItemProps({ item, index })}
              key={item.id}
              highlighted={index === highlightedIndex}
              onClick={() => handleSelectedItemChange({ selectedItem: item })}
              onMouseDown={(e) => {
                e.preventDefault();
              }}
            >
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
                width="50"
              />
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, No items found for {inputValue}</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}
