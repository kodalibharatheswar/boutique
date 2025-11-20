package com.boutique.config;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AuthController {

    @GetMapping("/login")
    public String loginPage() {
        return "auth/login";
    }

    // redirect based on role
//    @GetMapping("/post-login")
//    public String postLogin(Authentication auth) {
//        String role = auth.getAuthorities().iterator().next().getAuthority();
//
//        if (role.equals("ROLE_ADMIN")) {
//            return "redirect:/admin/dashboard";
//        }
//        return "redirect:/customer/dashboard";
//    }
}

