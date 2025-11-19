package com.boutique.customer.controller;


import com.boutique.customer.dto.CreateCustomerRequest;
import com.boutique.customer.dto.CustomerDto;
import com.boutique.customer.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping("/customers")
public class CustomerController {


    private final CustomerService service;


    public CustomerController(CustomerService service) {
        this.service = service;
    }


    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("createCustomerRequest", new CreateCustomerRequest());
        return "customers/register"; // Thymeleaf template path
    }


    @PostMapping("/register")
    public String registerSubmit(@Valid @ModelAttribute CreateCustomerRequest req, Model model) {
        try {
            CustomerDto dto = service.createCustomer(req);
            model.addAttribute("customer", dto);
            return "customers/registered";
        } catch (IllegalArgumentException ex) {
            model.addAttribute("error", ex.getMessage());
            return "customers/register";
        }
    }
}