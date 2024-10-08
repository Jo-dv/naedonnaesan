package com.example.back.dashboard.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.back.dashboard.document.Article;


public interface ArticleRepository extends MongoRepository<Article, String> {
	@Query("{'published': {$regex: ?0}}")
	Page<Article> findByAll(String publishedDate, Pageable pageable);
	@Query("{'published': {$regex: ?0}, 'title': {$regex: ?1, $options: 'i'}}")
	Page<Article> findByTitleContaining(String publishedDate, String searchWord, Pageable pageable);
	Optional<Article> findById(String id);
}
