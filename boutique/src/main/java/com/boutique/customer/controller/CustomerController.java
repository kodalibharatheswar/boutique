package com.boutique.customer.controller;

import com.boutique.customer.dto.CreateCustomerRequest;
import com.boutique.customer.dto.CustomerDto;
import com.boutique.customer.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
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
        return "customers/register";
    }

    @PostMapping("/register")
    public String registerSubmit(@Valid @ModelAttribute CreateCustomerRequest req,
                                 BindingResult bindingResult,
                                 Model model) {
        // CRITICAL SECURITY FIX: Set role to CUSTOMER before validation
        req.setRole("CUSTOMER");

        // Check for validation errors
        if (bindingResult.hasErrors()) {
            return "customers/register";
        }

        try {
            CustomerDto dto = service.createCustomer(req);
            model.addAttribute("customer", dto);
            return "customers/registered";
        } catch (IllegalArgumentException ex) {
            model.addAttribute("error", ex.getMessage());
            return "customers/register";
        }
    }

    // --- NEW ADMIN REGISTRATION METHODS ---

    // 1. Show Admin Registration Form (URL: /customers/admin/register)
    @GetMapping("/admin/register")
    public String adminRegisterForm(Model model) {
        model.addAttribute("createCustomerRequest", new CreateCustomerRequest());
        return "customers/admin-register"; // Use new template
    }

    // 2. Handle Admin Registration Submission
    @PostMapping("/admin/register")
    public String adminRegisterSubmit(@Valid @ModelAttribute CreateCustomerRequest req,
                                      BindingResult bindingResult,
                                      Model model) {
        // CRITICAL: Explicitly set the role to ADMIN
        req.setRole("ADMIN");

        if (bindingResult.hasErrors()) {
            return "customers/admin-register";
        }

        try {
            CustomerDto dto = service.createCustomer(req);
            // Redirect to login after successful registration
            return "redirect:/login";
        } catch (IllegalArgumentException ex) {
            model.addAttribute("error", ex.getMessage());
            return "customers/admin-register";
        }
    }
}


/*
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
            // CRITICAL SECURITY FIX: Ensure all public registrations are for the CUSTOMER role.
            // We explicitly overwrite any user input here.
            req.setRole("CUSTOMER");

            CustomerDto dto = service.createCustomer(req);
            model.addAttribute("customer", dto);
            return "customers/registered";
        } catch (IllegalArgumentException ex) {
            model.addAttribute("error", ex.getMessage());
            return "customers/register";
        }
    }
}*/


