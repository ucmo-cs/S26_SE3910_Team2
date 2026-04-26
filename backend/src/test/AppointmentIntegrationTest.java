package com.ucm.appointmentsetting;

import com.ucm.appointmentsetting.dto.AppointmentRequest;
import com.ucm.appointmentsetting.entity.Appointment;
import com.ucm.appointmentsetting.entity.Branch;
import com.ucm.appointmentsetting.entity.Topic;
import com.ucm.appointmentsetting.repository.AppointmentRepository;
import com.ucm.appointmentsetting.repository.BranchRepository;
import com.ucm.appointmentsetting.repository.TopicRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class AppointmentIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Test
    void availableSlotsUseBranchSchedule() {
        Branch branch = findBranch("Downtown Branch").orElseThrow();
        LocalDate futureDate = nextScheduledDate(DayOfWeek.MONDAY);

        ResponseEntity<String[]> response = restTemplate.getForEntity(
                endpoint("/api/appointments/available-slots?branchId=%d&dateISO=%s", branch.getId(), futureDate),
                String[].class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<String> slots = Arrays.asList(response.getBody());
        assertThat(slots).isNotEmpty();
        assertThat(slots.get(0)).endsWith(futureDate + "T09:00");
        assertThat(slots).contains(futureDate + "T16:30");

        slots.forEach(slot -> {
            assertThat(slot).startsWith(futureDate.toString() + "T");
            String time = slot.substring(slot.indexOf('T') + 1);
            assertThat(LocalDate.parse(slot.substring(0, 10))).isEqualTo(futureDate);
            assertThat(time.compareTo("09:00") >= 0).isTrue();
            assertThat(time.compareTo("16:30") <= 0).isTrue();
        });
    }

    @Test
    void bookingRemovesReservedSlotAndRespectsSchedule() {
        Branch branch = findBranch("North Branch").orElseThrow();
        Topic topic = findTopic("Fraud Support").orElseThrow();
        LocalDate futureDate = nextScheduledDate(DayOfWeek.MONDAY);
        String slot = futureDate + "T08:30";

        AppointmentRequest request = createAppointmentRequest(branch.getId(), topic.getId(), slot);
        ResponseEntity<Appointment> createResponse = restTemplate.postForEntity(
                endpoint("/api/appointments"), request, Appointment.class);

        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(createResponse.getBody()).isNotNull();
        assertThat(createResponse.getBody().getAppointmentTime().toString()).isEqualTo("08:30");

        ResponseEntity<String[]> slotsResponse = restTemplate.getForEntity(
                endpoint("/api/appointments/available-slots?branchId=%d&dateISO=%s", branch.getId(), futureDate),
                String[].class
        );

        List<String> availableSlots = Arrays.asList(slotsResponse.getBody());
        assertThat(availableSlots).doesNotContain(slot);
        assertThat(availableSlots).contains(futureDate + "T09:00");

        AppointmentRequest invalidRequest = createAppointmentRequest(branch.getId(), topic.getId(), futureDate + "T17:00");
        ResponseEntity<Map> invalidResponse = restTemplate.postForEntity(
                endpoint("/api/appointments"), invalidRequest, Map.class);

        assertThat(invalidResponse.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(invalidResponse.getBody()).containsKey("message");
    }

    @Test
    void differentHoursByDayUseCorrectBranchSchedule() {
        Branch branch = findBranch("South Branch").orElseThrow();
        LocalDate saturday = nextScheduledDate(DayOfWeek.SATURDAY);

        ResponseEntity<String[]> response = restTemplate.getForEntity(
                endpoint("/api/appointments/available-slots?branchId=%d&dateISO=%s", branch.getId(), saturday),
                String[].class
        );

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        List<String> slots = Arrays.asList(response.getBody());
        assertThat(slots).isNotEmpty();
        assertThat(slots.get(0)).endsWith(saturday + "T09:00");
        assertThat(slots).contains(saturday + "T12:30");
        assertThat(slots).doesNotContain(saturday + "T13:00");
    }

    private AppointmentRequest createAppointmentRequest(Long branchId, Long topicId, String startISO) {
        AppointmentRequest request = new AppointmentRequest();
        request.setName("Test User");
        request.setEmail("test.user@example.com");
        request.setBranchId(branchId);
        request.setTopicId(topicId);
        request.setStartISO(startISO);
        request.setReason("Schedule test");
        return request;
    }

    private Optional<Branch> findBranch(String name) {
        return branchRepository.findAll().stream()
                .filter(branch -> name.equals(branch.getName()))
                .findFirst();
    }

    private Optional<Topic> findTopic(String name) {
        return topicRepository.findAll().stream()
                .filter(topic -> name.equals(topic.getName()))
                .findFirst();
    }

    private LocalDate nextScheduledDate(DayOfWeek targetDay) {
        LocalDate date = LocalDate.now().plusDays(1);
        while (date.getDayOfWeek() != targetDay) {
            date = date.plusDays(1);
        }
        return date;
    }

    private String endpoint(String format, Object... args) {
        return String.format("http://localhost:%d" + format, port, args);
    }
}
