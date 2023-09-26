package com.mis.tasks.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mis.tasks.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserQuestionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserQuestion.class);
        UserQuestion userQuestion1 = new UserQuestion();
        userQuestion1.setId(1L);
        UserQuestion userQuestion2 = new UserQuestion();
        userQuestion2.setId(userQuestion1.getId());
        assertThat(userQuestion1).isEqualTo(userQuestion2);
        userQuestion2.setId(2L);
        assertThat(userQuestion1).isNotEqualTo(userQuestion2);
        userQuestion1.setId(null);
        assertThat(userQuestion1).isNotEqualTo(userQuestion2);
    }
}
