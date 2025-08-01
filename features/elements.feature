Feature: Elements Testing
  As a user
  I want to test the Elements section
  So that I can verify form functionality

  Scenario: Fill and submit text box form
    Given I navigate to "https://demoqa.com/"
    When I click on "Elements"
    And I click on "Text Box" in the left panel
    And I fill in the text box form with:
      | Full Name        | John Doe                    |
      | Email           | john.doe@example.com        |
      | Current Address | 123 Main St, Toronto, ON   |
      | Permanent Address| 456 Oak Ave, Ottawa, ON    |
    And I click submit
    Then I should see the submitted information displayed
