import React, {Component} from 'react';
import AuctionEntry from './auctionentry.jsx';
import Filters from './filters.jsx';
import SearchBox from './searchBox.jsx';

export default class Auction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allEntries: [],
      entrys: []
    };
    this.updateEntrys = this.updateEntrys.bind(this);
    this.grabAuctions = this.grabAuctions.bind(this);
    this.sortEntries = this.sortEntries.bind(this);
    this.filterEntriesByCategory = this.filterEntriesByCategory.bind(this);
    this.filterEntriesByTime = this.filterEntriesByTime.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  componentDidMount () {   //  Have list of auctions before rendering the page
    this.grabAuctions();
  }

  updateEntrys (entryArray) {    //  Show filtered results
    this.setState({
      entrys: entryArray,
      allEntries: entryArray
    });
  }

  grabAuctions (e) {         // Ajax request for auction searching by using search-bar
    e && e.preventDefault();
    var context = this;
    var filter = '';
    //console.log($('#search').val());
    if ($('#search').val() !== '') {
      filter = $('#search').val();
    }
    $.ajax({
      method: 'GET',
      data: {
        search: filter
      },
      url: '/api/allitems',
      headers: {'Content-Type': 'application/json'},
      success: function (res) {
        //console.log(res);
        context.updateEntrys(res);
      }
    });
  }

  filterEntriesByCategory (e) {
    var filterValue = e.target.innerHTML;
    var filtered = this.state.allEntries.filter(function (entry) {
      return entry.category === filterValue;
    });
    this.setState({
      entrys: filtered
    });
    this.render();
  }

  filterEntriesByTime (e) {
    var context = this;
    var filterValue = e.target.innerHTML;
    var compareDate = new Date();

    Date.prototype.addHours = function(h) {    
      this.setTime(this.getTime() + (h*60*60*1000));
      return this;
    }

    if (filterValue === '1 hour') {
      compareDate.addHours(1);
    }
    if (filterValue === '1 day') {
      compareDate.addHours(24);
    }
    if (filterValue === '1 week') {
      compareDate.addHours(168);
    }

    var filtered = this.state.allEntries.filter(function (entry) {
      return Date.parse(entry.endDate) < compareDate.getTime();
    });

    this.setState({
      entrys: filtered
    });
  }

  clearFilter (e) {
    this.setState({
      entrys: this.state.allEntries
    });
  }

  sortEntries (e) {
    e.preventDefault();
    var sorter = e.target.value;
    if (sorter !== "") {
      if (sorter === "endPrice") {
        var x = this.state.entrys.sort(function (a, b) {
          return a.endPrice > b.endPrice;
        });
        this.setState({
          entrys: x
        });
      }
      if (sorter === "startPrice") {
        var x = this.state.entrys.sort(function (a, b) {
          return a.startPrice > b.startPrice;
        });
        this.setState({
          entrys: x
        });
      }
      if (sorter === "oldest") {
        var x = this.state.entrys.sort(function(a, b) {
          return a.startDate > b.startDate;
        });
        this.setState({
          entrys: x
        });
      }
      if (sorter === "newest") {
        var x = this.state.entrys.sort(function(a, b) {
          return a.startDate < b.startDate;
        });
        this.setState({
          entrys: x
        });
      }
    }
  }

  render () {
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="auction-header col-xs-12">
            <h3 className="col-xs-3 pull-xs-left">Current Auctions</h3>
            <div className="col-xs-5 pull-xs-right">
              <SearchBox className="search-form" grabAuctions={this.grabAuctions.bind(this)}/>
            </div>
            <div className="col-xs-3">
              <form>
                <h3></h3>
                <select onChange={this.sortEntries}>
                  <option value="">All</option>
                  <option value="startPrice">Low to High: Starting Price</option>
                  <option value="endPrice">Low to High: Ending Price</option>
                  <option value="newest">Newer Items First</option>
                  <option value="oldest">Older Items First</option>
                </select>
              </form>
            </div>
          </div>
          <div className="sidebar col-md-2 filter-side">
            <Filters className="bid-container" clickHandlerCategory={this.filterEntriesByCategory} 
              clickHandlerTime={this.filterEntriesByTime} clearFilter={this.clearFilter} 
              toggleCategories={this.showCategories} toggleTimes={this.showTimes} showCategories={this.state.showCategories} 
              showTimes={this.state.showTimes} />
          </div> 
          <div className="auction-listings col-md-8 off-set-2">
            {
              this.state.entrys.map((entry, i) => {
                return (<AuctionEntry key={i} parity={i % 2} item={entry} auth={this.props.auth} />);
              })
            }
          </div>
        </div>
      </div> 
    );
  }
}