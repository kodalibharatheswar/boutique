package com.boutique.customer.mapper;


import com.boutique.customer.entity.Customer;
import com.boutique.customer.dto.CustomerDto;
import com.boutique.customer.dto.CreateCustomerRequest;


public class CustomerMapper {
    public static CustomerDto toDto(Customer c) {
        if (c == null) return null;
        CustomerDto dto = new CustomerDto();
        dto.setId(c.getId());
        dto.setEmail(c.getEmail());
        dto.setFirstName(c.getFirstName());
        dto.setLastName(c.getLastName());
        dto.setPhone(c.getPhone());
        dto.setRole(c.getRole());
        return dto;
    }


    public static Customer fromCreateRequest(CreateCustomerRequest req, String hashedPassword) {
        Customer c = new Customer();
        c.setEmail(req.getEmail());
        c.setPasswordHash(hashedPassword);
        c.setFirstName(req.getFirstName());
        c.setLastName(req.getLastName());
        c.setPhone(req.getPhone());
        c.setRole(req.getRole());
        return c;
    }
}