pragma solidity ^0.4.19;

contract KYCPlus {
  
    string firstName;
    string middleName;
    string lastName;
    uint age;
    string customerAddress;
   
   function setCustomerDetails(string _fName, string _mName, string _lName, uint _age, string _customerAddress) public payable {
       firstName = _fName;
       middleName = _mName;
       lastName = _lName;
       age = _age;
       customerAddress = _customerAddress;
       
   }
   
   function getCustomerDetails() public constant returns (string, string, string, uint, string) {
       return (firstName,middleName,lastName,age,customerAddress);
   }
    
}