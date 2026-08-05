package com.riftfolio.backend.repository;

import com.riftfolio.backend.model.StockEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StockEntryRepository extends JpaRepository<StockEntry, UUID> {
    List<StockEntry> findByUserId(UUID userId);
    Optional<StockEntry> findByUserIdAndRiftcodexCardId(UUID userId, String riftcodexCardId);
}