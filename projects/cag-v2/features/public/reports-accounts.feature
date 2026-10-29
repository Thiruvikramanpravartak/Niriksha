@ui @regression @module:reports @sheet:RA @area:public
Feature: Reports & Accounts — public audit report browser
  As a researcher or citizen
  I want to search, filter, and paginate through audit reports
  So that I can quickly locate specific reports across departments and years

  Background:
    Given I navigate to the reports page

  Rule: Default listing, pagination and table density

    @TC:RA-01 @smoke @priority:high @type:functional
    Scenario: [RA-01] Reports listing renders initial table view with default page size and descending publication date order
      Then the reports table should be visible
      And the default rows per page should be 10
      And the page records no console errors

    @TC:RA-10 @smoke @priority:high @type:functional
    Scenario: [RA-10] Paging through audit reports returns distinct records with no duplicate identifiers across consecutive page views
      When I navigate to pagination page 2
      Then the displayed reports should belong to page 2 without duplicates from page 1
      And the reports table should be visible
      And the page records no console errors

    @TC:RA-13 @regression @priority:medium @type:functional
    Scenario: [RA-13] Sorting audit reports by publication date reorders the entire visible table in verified chronological sequence
      When I sort the reports table by publication date
      Then reports should be ordered chronologically
      And the reports table should be visible
      And the page records no console errors

    @TC:RA-14 @regression @priority:medium @type:ui
    Scenario: [RA-14] Sorting audit reports alphabetically by title reorganizes all table rows in predictable lexicographical order
      When I sort the reports table by title
      Then reports should be ordered alphabetically by title
      And the reports table should be visible
      And the page records no console errors

    @TC:RA-15 @regression @priority:high @type:functional
    Scenario: [RA-15] Changing rows per page dropdown dynamically expands table density while preserving active pagination boundaries
      When I select 25 rows per page
      Then the table should adjust to show up to 25 rows per page
      And the reports table should be visible
      And the page records no console errors

  Rule: Search and multidimensional filtering

    @TC:RA-02 @smoke @priority:high @type:functional
    Scenario: [RA-02] Keyword search returns only audit reports whose title or overview contains the specified search term
      When I search for reports with keyword "Direct Tax"
      Then all displayed report records should contain "Direct Tax"
      And the reports table should be visible
      And the page records no console errors

    @TC:RA-03 @TC:RA-04 @TC:RA-05 @TC:RA-06 @regression @priority:medium @type:functional
    Scenario Outline: [<tc>] Filtering reports listing by <filter> returns only audit records matching <value>
      When I apply the "<filter>" filter with the value "<value>"
      Then all displayed report records should match "<value>" for "<filter>"
      And the result count is not greater than the unfiltered total
      And clearing the filter restores the unfiltered result count
      And the page records no console errors

      Examples:
        | tc    | filter   | value               |
        | RA-03 | Year     | 2025                |
        | RA-04 | Ministry | Ministry of Finance |
        | RA-05 | Type     | Compliance          |
        | RA-06 | State    | Maharashtra         |

    @TC:RA-07 @regression @priority:medium @type:functional
    Scenario: [RA-07] Resetting applied filters clears all dropdown selections and restores the default unfiltered audit report listing
      When I apply report year filter "2025"
      And I reset all applied filters
      Then all filters should be cleared and default reports returned
      And the reports table should be visible
      And the page records no console errors

    @TC:RA-08 @smoke @priority:high @type:functional
    Scenario: [RA-08] Combining multiple filter criteria applies strict conjunct logic returning only records matching all selected parameters
      When I filter reports by year "2025" and category "Direct Tax"
      Then all displayed report records should match both year "2025" and category "Direct Tax"
      And the reports table should be visible
      And the page records no console errors

  Rule: Document detail inspection and secure downloads

    @TC:RA-11 @regression @priority:high @type:functional
    Scenario: [RA-11] Selecting an audit report row opens full metadata view displaying title, ministry, and publication dates accurately
      When I click view details on the first report
      Then the report detail view should display title, ministry, and publication date
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:RA-12 @regression @priority:high @type:functional
    Scenario: [RA-12] Report document download action provides an accessible valid PDF link without causing corrupted file transfers
      Then each report record should provide a downloadable PDF link
      And the reports table should be visible
      And the page records no console errors

  Rule: Empty states and query sanitization

    @TC:RA-09 @regression @priority:medium @type:functional
    Scenario: [RA-09] Searching for a non-existent report keyword renders an informative empty state message with zero rows
      When I search for reports with keyword "NonExistentTermXYZ99"
      Then a friendly no results found message should be displayed
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:RA-16 @regression @priority:medium @type:security
    Scenario: [RA-16] Submitting search queries with special characters sanitizes input safely without triggering script injection or errors
      When I search for reports with keyword "Tax <script>alert(1)</script>"
      Then the query should be safely handled without script injection or system errors
      And the page returns no 5xx response
      And the page records no console errors
