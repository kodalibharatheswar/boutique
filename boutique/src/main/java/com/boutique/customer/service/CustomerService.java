package com.boutique.customer.service;


import com.boutique.customer.dto.CreateCustomerRequest;
import com.boutique.customer.dto.CustomerDto;


public interface CustomerService {
    CustomerDto createCustomer(CreateCustomerRequest req);
    CustomerDto getCustomerById(String id);
    CustomerDto getCustomerByEmail(String email);
    void deleteCustomer(String id);
}