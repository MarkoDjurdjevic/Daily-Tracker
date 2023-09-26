package com.mis.tasks.repository;

import com.mis.tasks.domain.UserQuestion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserQuestion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserQuestionRepository extends JpaRepository<UserQuestion, Long> {}
