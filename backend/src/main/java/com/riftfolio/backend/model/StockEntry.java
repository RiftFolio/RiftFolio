package com.riftfolio.backend.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "stock_entries")
public class StockEntry {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "riftcodex_card_id", nullable = false)
    private String riftcodexCardId;

    @Column(nullable = false)
    private int quantity;

    public StockEntry() {
    }

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRiftcodexCardId() {
        return riftcodexCardId;
    }

    public void setRiftcodexCardId(String riftcodexCardId) {
        this.riftcodexCardId = riftcodexCardId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}