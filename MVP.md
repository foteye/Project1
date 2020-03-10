# The Hippy Book - Minimum Viable Product

## Product

### Personas
* Reader (End Users)

### User Expectations
* 'Authenticated' login
* Books can be traded with anyone using the platform
* No more than the 50 most relevant results are returned at one time for a search (performance)
* Any book added to a user library should be validated against an actual book returned by the GoodReads API

### Features
* Log in
* Keep me logged in
* Display wishlist
* Display books that you are willing to trade
* Display currently owned books (Library)
* Search for a Book
* Display book information
* Suggest Trade
* Initiate Trade
* Accept/Reject Trade

## Requirements

### User Stories/Journeys
* AS A Reader I WANT to list books I have in my library up for trade SO THAT I can be matched with someone to trade
* AS A Reader I WANT to list books I am interested in reading (wishlist) SO THAT I can be matched with someone to trade
* AS A Reader I WANT to view and update what books I own
* AS A Reader I WANT to be notified if someone has a book I want SO THAT I can initiate a trade with them
* AS A Reader I WANT to be notified if someone has initiated a trade with me SO THAT I can accept/reject it
* AS A Reader I WANT my library to update after a successful trade
* AS A Reader I WANT my session to be saved SO THAT I don't have to log in when I refresh the page

### Evidence
* Incoming book appears in library/Outgoing book vanishes from library
* Transaction History

### Channels
* Single Dashboard-esque page where everything can be viewed

### Out of Scope
* Multiple books being traded
* Bootstrap

## Dependencies/DeepDive

### API's/Frameworks Used
* Good Reads API
* Google Sheets API
* Semantic UI (CSS)
* jQuery
* Moment.js

### External Dependencies
* Persistence in a series of Google Sheets
  * Login information
  * User Libraries
  * Trade History

### Follow Ups (Deep Dives)
* Google Sheet API
  * Can we export/import as CSV/JSON
* Good Reads API Documentation (What information can we get)
  * 