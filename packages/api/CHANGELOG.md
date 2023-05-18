# Changelog

## [2023-01-25] version 1.5.0

- ### **Updates**

  - [UPDATE] Factorization of the partial consumer routes
  - [NEW] Added balance transfer functionality
  - [NEW] Displaying the total saved by users

## [2022-10-22] version 1.4.4

- ### **Updates**

  - [BUGFIX] Fixed bug with apollo server and using graphql in production

## [2022-10-22] version 1.4.3

- ### **Updates**

  - [BUGFIX] Fixed bug with apollo server and using graphql

## [2022-10-12] version 1.4.2

- ### **Updates**

  - [UPDATE] New purchase approval route created by consumers
  - [UPDATE] Removed city validation in consumer balance usage

## [2022-10-01] version 1.4.1

- ### **Updates**

  - [BUG FIX] Removed apollo server to fix error

## [2022-09-30] version 1.4.0

- ### **Updates**

  - Implemented representative functionality
  - Modified server starter
  - Upgraded typescript to version 4.8.4

## [2022-09-06] version 1.3.0

- ### **Updates**

  - Implemented back value functionality in cashbacks

## [2022-07-28] version 1.2.8

- ### **Updates**

  - Changed cpf validation function
  - Allow any user to manager supports
  - Created use case, controller and route for signature change (Forgot and Reset Signature)
  - Created a new context for costumerAccount and moved use cases of register, deactive account and verify account to him

## [2022-07-06] version 1.2.7

- ### **Updates**

  - Implemented company payment monthly functionality

## [2022-07-05] version 1.2.6

- ### **Updates**

  - Added date validation on function to generate company monthlies

## [2022-07-04] version 1.2.5

- ### **Updates**

  - Updated company period free in monthlies generation use case
  - Updated costumer companies to search only for companies allowed in the system

## [2022-07-04] version 1.2.4

- ### **Updates**

  - Updated monthlies generation use case

## [2022-07-02] version 1.2.3

- ### **Updates**

  - Added aux variable to companies controllers to consumers users

## [2022-06-30] version 1.2.2

- ### **Updates**

  - Created new collumn in settings table to qrcode key

## [2022-06-27] version 1.2.1

- ### **Updates**

  - Updated companies controllers to consumers users

## [2022-06-25] version 1.2.0

- ### **Updates**

  - Refatored Use Case for Generate Company Monthly Payment
  - Updated payment circle for payment orders
  - Updated queries and filters to company management

## [2022-06-17] version 1.1.0

- ### **Updates**
  - Created columns cpf and password in SupportUsers table
  - Created column permissionToSupportAccess in Company table
  - Created route to register support user
  - Created route to update support user
  - Added permissionToSupportAccess in company data update route
  - Created function to supportUser login
  - Added verification for supportUser in generateCashback
  - Created route for find all support users
  - Adjust on restrition for support make cashback
  - Added restrition to update support update password
  - Implemented support users visibility only for root user
  - Fixed error in support users update password
  - Updated route of company login to support user login
  - Implemented property verification isRootUser in companyAuthMiddleware
  - Created route to toggle permissionToSupportUser update in company
  - Created route to find permission

## [2022-06-06] version 1.0.6

- ### **Updates**

  - Fixed error on update company industry

## [2022-06-02] version 1.0.5

- ### **Updates**

  - Created route and filters to cashback report
  - Fixed bug on calculate total of cashback in report
  - Implemented report of cashabcks
  - Implemented field for CPF in AllowCompanyFirstAccess
  - adjust find filters to report of cashbacks
  - fixed error on filter order in cashback report
  - adjust find filters to report of cashbacks
  - fixed error on filter order in cashback report
  - Adjust filters
  - Adjust headers on reports
  - Removed filters by input select of companies, paymentOrder and client
  - Created new column in transaction table for expiredDate
  - Created function to save expiredDate of transaction in generateCashback
  - Function created to update ExpiredDate for cashbacks already issued
  - Add new informations in reports companies
  - Adjust filter cashback by date of expiredDate
  - Revert last migration creation of expiredDate
  - Created multiply filter by cashback status
  - Created multiply filter by cashback payment methods
  - Adjust error on multiply filters on query

## [2022-05-11] version 1.0.4

- ### **Updates**

  - Created function to write reports in PDF and Excel
  - Fixed error on company address
  - Created route static for browser access past of reports
  - Changed the dynamics of temporary access control
  - Created company report

## [2022-05-06] version 1.0.3

- ### **Updates**

  - Fixed error on send payment info to company email

## [2022-05-05] version 1.0.2

- ### **Updates**

  - Fixed company user update query error

## [2022-05-04] version 1.0.1

- ### **Updates**

  - Updated query to find company payment methods to find only actived methods

## [2022-05-02] version 1.0.0
