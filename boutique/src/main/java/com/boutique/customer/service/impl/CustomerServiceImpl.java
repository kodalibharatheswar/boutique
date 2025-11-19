package com.boutique.customer.service.impl;


import com.boutique.customer.dto.CreateCustomerRequest;
import com.boutique.customer.dto.CustomerDto;
import com.boutique.customer.entity.Customer;
import com.boutique.customer.mapper.CustomerMapper;
import com.boutique.customer.repository.CustomerRepository;
import com.boutique.customer.service.CustomerService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.NoSuchElementException;


@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {


    private final CustomerRepository repo;
    private final PasswordEncoder passwordEncoder;


    public CustomerServiceImpl(CustomerRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public CustomerDto createCustomer(CreateCustomerRequest req) {
        if (repo.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        String hashed = passwordEncoder.encode(req.getPassword());
        Customer c = CustomerMapper.fromCreateRequest(req, hashed);
        Customer saved = repo.save(c);
        return CustomerMapper.toDto(saved);
    }


    @Override
    public CustomerDto getCustomerById(String id) {
        Customer c = repo.findById(id).orElseThrow(() -> new NoSuchElementException("Customer not found"));
        return CustomerMapper.toDto(c);
    }


    @Override
    public CustomerDto getCustomerByEmail(String email) {
        Customer c = repo.findByEmail(email).orElseThrow(() -> new NoSuchElementException("Customer not found"));
        return CustomerMapper.toDto(c);
    }


    @Override
    public void deleteCustomer(String id) {
        repo.deleteById(id);
    }
}