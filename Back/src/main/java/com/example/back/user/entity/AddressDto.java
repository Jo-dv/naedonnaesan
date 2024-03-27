package com.example.back.user.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class AddressDto {
    private String address;
    private String x;
    private String y;
}
