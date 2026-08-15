package com.riftfolio.backend.controller;

import com.riftfolio.backend.model.StockEntry;
import com.riftfolio.backend.model.User;
import com.riftfolio.backend.repository.StockEntryRepository;
import com.riftfolio.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users/{userId}/stock")
public class StockController {

    private final StockEntryRepository stockEntryRepository;
    private final UserRepository userRepository;

    public StockController(StockEntryRepository stockEntryRepository, UserRepository userRepository) {
        this.stockEntryRepository = stockEntryRepository;
        this.userRepository = userRepository;
    }

    private void checkOwnership(UUID userId, Authentication authentication) {
        UUID authenticatedUserId = (UUID) authentication.getPrincipal();
        if (!authenticatedUserId.equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes acceder al stock de otro usuario");
        }
    }

    @GetMapping
    public List<StockEntry> getStock(@PathVariable UUID userId, Authentication authentication) {
        checkOwnership(userId, authentication);
        return stockEntryRepository.findByUserId(userId);
    }

    @PostMapping
    public StockEntry addCard(@PathVariable UUID userId, @RequestBody AddCardRequest request, Authentication authentication) {
        checkOwnership(userId, authentication);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        StockEntry entry = stockEntryRepository
                .findByUserIdAndRiftcodexCardId(userId, request.riftcodexCardId())
                .orElseGet(() -> {
                    StockEntry newEntry = new StockEntry();
                    newEntry.setUser(user);
                    newEntry.setRiftcodexCardId(request.riftcodexCardId());
                    newEntry.setQuantity(0);
                    return newEntry;
                });

        entry.setQuantity(entry.getQuantity() + request.delta());
        return stockEntryRepository.save(entry);
    }

    public record AddCardRequest(String riftcodexCardId, int delta) {
    }
}