package com.boutique.customer.controller.api;


import com.boutique.customer.dto.CreateCustomerRequest;
import com.boutique.customer.dto.CustomerDto;
import com.boutique.customer.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/customers")
public class CustomerRestController {


    private final CustomerService service;


    public CustomerRestController(CustomerService service) {
        this.service = service;
    }


    @PostMapping
    public ResponseEntity<CustomerDto> create(@Valid @RequestBody CreateCustomerRequest req) {
        CustomerDto dto = service.createCustomer(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }


    @GetMapping("/{id}")
    public ResponseEntity<CustomerDto> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getCustomerById(id));
    }


    @GetMapping("/by-email")
    public ResponseEntity<CustomerDto> getByEmail(@RequestParam String email) {
        return ResponseEntity.ok(service.getCustomerByEmail(email));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}