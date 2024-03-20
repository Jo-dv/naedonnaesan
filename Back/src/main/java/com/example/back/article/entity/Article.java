package com.example.back.article.entity;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "article_id")
    private Long articleId;

    @Lob
    private String content; // 본문은 길 수 있으므로 @Lob 사용

    @Column(length = 2048)
    private String imageUrl;

    private String title; // 제목은 보통 길지 않으므로 VARCHAR로 충분함
}

