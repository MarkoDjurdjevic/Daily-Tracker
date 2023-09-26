package com.mis.tasks.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mis.tasks.IntegrationTest;
import com.mis.tasks.domain.UserQuestion;
import com.mis.tasks.repository.UserQuestionRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UserQuestionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserQuestionResourceIT {

    private static final String ENTITY_API_URL = "/api/user-questions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserQuestionRepository userQuestionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserQuestionMockMvc;

    private UserQuestion userQuestion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserQuestion createEntity(EntityManager em) {
        UserQuestion userQuestion = new UserQuestion();
        return userQuestion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserQuestion createUpdatedEntity(EntityManager em) {
        UserQuestion userQuestion = new UserQuestion();
        return userQuestion;
    }

    @BeforeEach
    public void initTest() {
        userQuestion = createEntity(em);
    }

    @Test
    @Transactional
    void createUserQuestion() throws Exception {
        int databaseSizeBeforeCreate = userQuestionRepository.findAll().size();
        // Create the UserQuestion
        restUserQuestionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userQuestion)))
            .andExpect(status().isCreated());

        // Validate the UserQuestion in the database
        List<UserQuestion> userQuestionList = userQuestionRepository.findAll();
        assertThat(userQuestionList).hasSize(databaseSizeBeforeCreate + 1);
        UserQuestion testUserQuestion = userQuestionList.get(userQuestionList.size() - 1);
    }

    @Test
    @Transactional
    void createUserQuestionWithExistingId() throws Exception {
        // Create the UserQuestion with an existing ID
        userQuestion.setId(1L);

        int databaseSizeBeforeCreate = userQuestionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserQuestionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userQuestion)))
            .andExpect(status().isBadRequest());

        // Validate the UserQuestion in the database
        List<UserQuestion> userQuestionList = userQuestionRepository.findAll();
        assertThat(userQuestionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUserQuestions() throws Exception {
        // Initialize the database
        userQuestionRepository.saveAndFlush(userQuestion);

        // Get all the userQuestionList
        restUserQuestionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userQuestion.getId().intValue())));
    }

    @Test
    @Transactional
    void getUserQuestion() throws Exception {
        // Initialize the database
        userQuestionRepository.saveAndFlush(userQuestion);

        // Get the userQuestion
        restUserQuestionMockMvc
            .perform(get(ENTITY_API_URL_ID, userQuestion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userQuestion.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingUserQuestion() throws Exception {
        // Get the userQuestion
        restUserQuestionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUserQuestion() throws Exception {
        // Initialize the database
        userQuestionRepository.saveAndFlush(userQuestion);

        int databaseSizeBeforeUpdate = userQuestionRepository.findAll().size();

        // Update the userQuestion
        UserQuestion updatedUserQuestion = userQuestionRepository.findById(userQuestion.getId()).get();
        // Disconnect from session so that the updates on updatedUserQuestion are not directly saved in db
        em.detach(updatedUserQuestion);

        restUserQuestionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserQuestion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserQuestion))
            )
            .andExpect(status().isOk());

        // Validate the UserQuestion in the database
        List<UserQuestion> userQuestionList = userQuestionRepository.findAll();
        assertThat(userQuestionList).hasSize(databaseSizeBeforeUpdate);
        UserQuestion testUserQuestion = userQuestionList.get(userQuestionList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingUserQuestion() throws Exception {
        int databaseSizeBeforeUpdate = userQuestionRepository.findAll().size();
        userQuestion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserQuestionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userQuestion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userQuestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserQuestion in the database
        List<UserQuestion> userQuestionList = userQuestionRepository.findAll();
        assertThat(userQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserQuestion() throws Exception {
        int databaseSizeBeforeUpdate = userQuestionRepository.findAll().size();
        userQuestion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserQuestionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userQuestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserQuestion in the database
        List<UserQuestion> userQuestionList = userQuestionRepository.findAll();
        assertThat(userQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserQuestion() throws Exception {
        int databaseSizeBeforeUpdate = userQuestionRepository.findAll().size();
        userQuestion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserQuestionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userQuestion)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserQuestion in the database
        List<UserQuestion> userQuestionList = userQuestionRepository.findAll();
        assertThat(userQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserQuestionWithPatch() throws Exception {
        // Initialize the database
        userQuestionRepository.saveAndFlush(userQuestion);

        int databaseSizeBeforeUpdate = userQuestionRepository.findAll().size();

        // Update the userQuestion using partial update
        UserQuestion partialUpdatedUserQuestion = new UserQuestion();
        partialUpdatedUserQuestion.setId(userQuestion.getId());

        restUserQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserQuestion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserQuestion))
            )
            .andExpect(status().isOk());

        // Validate the UserQuestion in the database
        List<UserQuestion> userQuestionList = userQuestionRepository.findAll();
        assertThat(userQuestionList).hasSize(databaseSizeBeforeUpdate);
        UserQuestion testUserQuestion = userQuestionList.get(userQuestionList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateUserQuestionWithPatch() throws Exception {
        // Initialize the database
        userQuestionRepository.saveAndFlush(userQuestion);

        int databaseSizeBeforeUpdate = userQuestionRepository.findAll().size();

        // Update the userQuestion using partial update
        UserQuestion partialUpdatedUserQuestion = new UserQuestion();
        partialUpdatedUserQuestion.setId(userQuestion.getId());

        restUserQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserQuestion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserQuestion))
            )
            .andExpect(status().isOk());

        // Validate the UserQuestion in the database
        List<UserQuestion> userQuestionList = userQuestionRepository.findAll();
        assertThat(userQuestionList).hasSize(databaseSizeBeforeUpdate);
        UserQuestion testUserQuestion = userQuestionList.get(userQuestionList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingUserQuestion() throws Exception {
        int databaseSizeBeforeUpdate = userQuestionRepository.findAll().size();
        userQuestion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userQuestion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userQuestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserQuestion in the database
        List<UserQuestion> userQuestionList = userQuestionRepository.findAll();
        assertThat(userQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserQuestion() throws Exception {
        int databaseSizeBeforeUpdate = userQuestionRepository.findAll().size();
        userQuestion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userQuestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserQuestion in the database
        List<UserQuestion> userQuestionList = userQuestionRepository.findAll();
        assertThat(userQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserQuestion() throws Exception {
        int databaseSizeBeforeUpdate = userQuestionRepository.findAll().size();
        userQuestion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(userQuestion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserQuestion in the database
        List<UserQuestion> userQuestionList = userQuestionRepository.findAll();
        assertThat(userQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserQuestion() throws Exception {
        // Initialize the database
        userQuestionRepository.saveAndFlush(userQuestion);

        int databaseSizeBeforeDelete = userQuestionRepository.findAll().size();

        // Delete the userQuestion
        restUserQuestionMockMvc
            .perform(delete(ENTITY_API_URL_ID, userQuestion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserQuestion> userQuestionList = userQuestionRepository.findAll();
        assertThat(userQuestionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
