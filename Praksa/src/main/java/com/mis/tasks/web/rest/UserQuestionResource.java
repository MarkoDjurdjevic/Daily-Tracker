package com.mis.tasks.web.rest;

import com.mis.tasks.domain.UserQuestion;
import com.mis.tasks.repository.UserQuestionRepository;
import com.mis.tasks.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mis.tasks.domain.UserQuestion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserQuestionResource {

    private final Logger log = LoggerFactory.getLogger(UserQuestionResource.class);

    private static final String ENTITY_NAME = "userQuestion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserQuestionRepository userQuestionRepository;

    public UserQuestionResource(UserQuestionRepository userQuestionRepository) {
        this.userQuestionRepository = userQuestionRepository;
    }

    /**
     * {@code POST  /user-questions} : Create a new userQuestion.
     *
     * @param userQuestion the userQuestion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userQuestion, or with status {@code 400 (Bad Request)} if the userQuestion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-questions")
    public ResponseEntity<UserQuestion> createUserQuestion(@RequestBody UserQuestion userQuestion) throws URISyntaxException {
        log.debug("REST request to save UserQuestion : {}", userQuestion);
        if (userQuestion.getId() != null) {
            throw new BadRequestAlertException("A new userQuestion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserQuestion result = userQuestionRepository.save(userQuestion);
        return ResponseEntity
            .created(new URI("/api/user-questions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-questions/:id} : Updates an existing userQuestion.
     *
     * @param id the id of the userQuestion to save.
     * @param userQuestion the userQuestion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userQuestion,
     * or with status {@code 400 (Bad Request)} if the userQuestion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userQuestion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-questions/{id}")
    public ResponseEntity<UserQuestion> updateUserQuestion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserQuestion userQuestion
    ) throws URISyntaxException {
        log.debug("REST request to update UserQuestion : {}, {}", id, userQuestion);
        if (userQuestion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userQuestion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userQuestionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UserQuestion result = userQuestionRepository.save(userQuestion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userQuestion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /user-questions/:id} : Partial updates given fields of an existing userQuestion, field will ignore if it is null
     *
     * @param id the id of the userQuestion to save.
     * @param userQuestion the userQuestion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userQuestion,
     * or with status {@code 400 (Bad Request)} if the userQuestion is not valid,
     * or with status {@code 404 (Not Found)} if the userQuestion is not found,
     * or with status {@code 500 (Internal Server Error)} if the userQuestion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/user-questions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UserQuestion> partialUpdateUserQuestion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UserQuestion userQuestion
    ) throws URISyntaxException {
        log.debug("REST request to partial update UserQuestion partially : {}, {}", id, userQuestion);
        if (userQuestion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userQuestion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userQuestionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UserQuestion> result = userQuestionRepository
            .findById(userQuestion.getId())
            .map(existingUserQuestion -> {
                return existingUserQuestion;
            })
            .map(userQuestionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userQuestion.getId().toString())
        );
    }

    /**
     * {@code GET  /user-questions} : get all the userQuestions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userQuestions in body.
     */
    @GetMapping("/user-questions")
    public List<UserQuestion> getAllUserQuestions() {
        log.debug("REST request to get all UserQuestions");
        return userQuestionRepository.findAll();
    }

    /**
     * {@code GET  /user-questions/:id} : get the "id" userQuestion.
     *
     * @param id the id of the userQuestion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userQuestion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-questions/{id}")
    public ResponseEntity<UserQuestion> getUserQuestion(@PathVariable Long id) {
        log.debug("REST request to get UserQuestion : {}", id);
        Optional<UserQuestion> userQuestion = userQuestionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userQuestion);
    }

    /**
     * {@code DELETE  /user-questions/:id} : delete the "id" userQuestion.
     *
     * @param id the id of the userQuestion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-questions/{id}")
    public ResponseEntity<Void> deleteUserQuestion(@PathVariable Long id) {
        log.debug("REST request to delete UserQuestion : {}", id);
        userQuestionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
