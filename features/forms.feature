Feature: Forms Testing
  As a user
  I want to test the Forms section
  So that I can verify student registration functionality

  Scenario: Complete student registration form
    Given I navigate to "https://demoqa.com/"
    When I click on "Forms"
    And I click on "Practice Form" in the left panel
    And I fill in the student registration form with:
      | First Name     | Jane                           |
      | Last Name      | Smith                          |
      | Email          | jane.smith@example.com         |
      | Gender         | Female                         |
      | Mobile Number  | 4161234567                     |
      | Date of Birth  | 20 years ago from today        |
      | Subjects       | Math, Computer Science         |
      | Hobbies        | Reading, Sports                |
      | Current Address| 789 Elm St, Toronto, ON       |
      | State          | NCR                            |
      | City           | Delhi                          |
    And I click submit
    Then I should see the registration confirmation
