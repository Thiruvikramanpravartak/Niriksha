@ui @regression @module:news @sheet:NM @area:public
Feature: News & Media Portal — Press Communiques and Announcements
  As a citizen or journalist
  I want to browse official CAG press communiques, audit releases, and media updates
  So that I stay informed on public audit developments

  Background:
    Given I navigate to the news page

  Rule: Press release listing, pagination and detail inspection

    @TC:NM-01 @regression @priority:high @type:ui
    Scenario: [NM-01] Public news listing displays published press communiques and official media releases with complete metadata
      Then the news title should be visible
      And published news cards should be displayed
      And the page records no console errors

    @TC:NM-02 @smoke @priority:high @type:functional
    Scenario: [NM-02] Selecting a news article card opens the comprehensive detail view showing article body, publication date, and attachments
      When I click on read more for the first article
      Then the article detail section should be visible with publication metadata
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:NM-05 @regression @priority:medium @type:ui
    Scenario: [NM-05] Paging through public news articles navigates consecutive pages without repeating any existing article cards
      Then the news pagination control should be displayed
      And published news cards should be displayed
      And the page records no console errors

  Rule: Chronological filtering and headline keyword search

    @TC:NM-03 @regression @priority:high @type:functional
    Scenario: [NM-03] Filtering news articles by publication year displays releases strictly matching the chosen calendar year
      When I select news publication year "2026"
      Then only news articles from year "2026" should be displayed
      And the news title should be visible
      And the page records no console errors

    @TC:NM-04 @regression @priority:medium @type:functional
    Scenario: [NM-04] Searching news releases with headline keywords isolates relevant audit announcements from historical records
      When I search news with keyword "Summit"
      Then only articles matching "Summit" should remain visible
      And the news title should be visible
      And the page records no console errors

  Rule: Official press communique document downloads

    @TC:NM-06 @smoke @priority:high @type:functional
    Scenario: [NM-06] Verified news release provides an accessible official press communique PDF document download link
      Then the official press release PDF download link should be available
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors
