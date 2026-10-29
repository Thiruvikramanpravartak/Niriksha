@ui @regression @module:states @sheet:SS @area:public
Feature: State Offices & Subsites Directory — Regional PAG Presence
  As a citizen or regional stakeholder
  I want to access Principal Accountant General (PAG) state office directories
  So that I can locate local audit authorities, subsite portals, and state audit reports

  Background:
    Given I navigate to the state offices directory

  Rule: Regional jurisdiction listing and view modes

    @TC:SS-02 @regression @priority:high @type:functional
    Scenario: [SS-02] State offices directory lists regional jurisdiction cards across states and union territories without omitted entries
      Then the state directory page title should be visible
      And state office cards should be displayed for Delhi, Maharashtra, and Karnataka
      And the page records no console errors

    @TC:SS-10 @regression @priority:high @type:ui
    Scenario: [SS-10] Toggling between geographic map and list views alternates visual representation while maintaining active state selections
      When I toggle the directory view between list and map
      Then the selected view toggle mode should be active
      And the state directory page title should be visible
      And the page records no console errors

  Rule: Directory search and navigation

    @TC:SS-01 @smoke @priority:high @type:functional
    Scenario: [SS-01] Selecting a state office card navigates directly to the dedicated regional Principal Accountant General subsite view
      Then state subsite links should point to valid regional subsite routes
      And the state directory page title should be visible
      And the page records no console errors

    @TC:SS-04 @regression @priority:medium @type:functional
    Scenario: [SS-04] Searching the state directory by state or office name filters regional jurisdiction cards dynamically
      When I search the state directory for "Maharashtra"
      Then only the Maharashtra state office card should remain visible
      And the state directory page title should be visible
      And the page records no console errors

  Rule: Officer authority and regional report linkage

    @TC:SS-06 @regression @priority:medium @type:functional
    Scenario: [SS-06] State office detail card displays designated Principal Accountant General authority name and regional address details
      Then the PAG office name and designated officer should be displayed for Delhi
      And the state directory page title should be visible
      And the page records no console errors

    @TC:SS-08 @smoke @priority:medium @type:functional
    Scenario: [SS-08] State office cards provide direct links to regional audit reports and state appropriation accounts
      Then regional audit reports and accounts links should be present on each state card
      And the state directory page title should be visible
      And the page records no console errors
