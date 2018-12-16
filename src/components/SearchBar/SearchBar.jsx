import React, { Component } from 'react';
import './SearchBar.styl';

const SearchBar = ({ onFilter }) => {
  return (
    <form className='search-form'>
      <div className='form-group has-feedback'>
        <input
          type='text'
          className='form-control'
          placeholder='Marker Search'
          onChange={onFilter}
        />
        <span className='glyphicon glyphicon-search form-control-feedback' />
      </div>
    </form>
  );
}

export default SearchBar;
