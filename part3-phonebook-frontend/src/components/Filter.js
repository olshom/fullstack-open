const Filter = ({newFilter, handleSearch}) => {
    return (
      <div>
      filter shown with <input value={newFilter} onChange={handleSearch}/>
      </div>
    )
  }

export default Filter