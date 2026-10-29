@ui @regression @module:bilingual @sheet:BL @area:public
Feature: Bilingual Language Switching and Localization
  As a citizen of India
  I want to switch between English and Hindi
  So that I can read content in my preferred official language

  Rule: Language toggle availability and interface translation

    @TC:BL-01 @smoke @priority:high @type:localization
    Scenario: [BL-01] Bilingual language toggle is prominently visible and provides functional options for English and Hindi interfaces
      Given I navigate to the home page
      Then the language toggle should be visible with English and Hindi options
      And the official national emblem logo should be displayed in the header
      And the page records no console errors

    @TC:BL-05 @regression @priority:high @type:localization
    Scenario: [BL-05] Selecting Hindi updates core portal interface headings and navigation links without untranslated English text fallbacks
      Given I navigate to the home page
      When I switch language to Hindi
      Then major interface headings and navigation links should reflect Hindi translations
      And the language toggle should be visible with English and Hindi options
      And the page records no console errors

  Rule: Session persistence and browser reload stability

    @TC:BL-02 @smoke @priority:high @type:localization
    Scenario: [BL-02] Switching the portal language to Hindi persists the language selection across subsequent page navigation
      Given I navigate to the home page
      When I switch language to Hindi
      And I navigate to the reports page
      Then the language should remain set to Hindi
      And the reports table should be visible
      And the page records no console errors

    @TC:BL-03 @regression @priority:high @type:localization
    Scenario: [BL-03] Hindi language preference remains active and correctly renders Devanagari script across browser reload actions
      Given I navigate to the home page
      When I switch language to Hindi
      And I refresh the page
      Then the language preference should persist as Hindi
      And the language toggle should be visible with English and Hindi options
      And the page records no console errors

  Rule: Deep linking and URL localization parameter

    @TC:BL-04 @regression @priority:medium @type:localization
    Scenario: [BL-04] Direct deep-link URL navigation containing the Hindi language query parameter renders translated content immediately
      Given I navigate directly to the home page with parameter "lang=hi"
      Then the page should immediately render with Hindi active
      And the language toggle should be visible with English and Hindi options
      And the page records no console errors
