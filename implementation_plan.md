# Rebuild Faculty Attendance UI to Match Premium Reference Design

We will completely overhaul the `AttendanceManager.tsx` component to perfectly match the highly polished, premium UI shown in the reference image. This will involve significant CSS enhancements, a new grid layout, new interactive UI elements, and backend updates to support the new real-time data requirements.

## User Review Required

> [!IMPORTANT]
> The reference image includes several new features that our current database/backend doesn't fully support yet (like a daily timetable scheduling system with specific time slots and rooms). I will need to mock some of this specific data temporarily (like the exact "Today's Classes" timetable) or build out new backend models. **Please confirm if you want me to build the full Timetable backend logic, or mock the timetable UI for now while focusing on making the Mark Attendance and Low Attendance features real-time.**

## Open Questions

1.  **"Class / Section" and "Lecture / Period" fields:** The design has these fields, but our current DB only tracks `subject_id` and `date`. Should I add these to the backend models, or hide/disable them for now?
2.  **JAVA/frontend/index.html:** I searched your file system but could not locate the `JAVA` folder you mentioned. I will recreate this design entirely from scratch using React and CSS based on your screenshot. Is that okay?

## Proposed Changes

### `frontend/src/pages/faculty/AttendanceManager.tsx`
-   **[MODIFY]** Restructure the layout to use a modern CSS Grid.
-   **[MODIFY]** Add the 5 top statistic cards (Total Subjects, Today's Classes, Attendance Marked, Pending, Total Students).
-   **[MODIFY]** Build the new "Mark Attendance" form with beautiful glowing radio buttons for Present/Absent/Late and a primary "Proceed to Mark ->" action button.
-   **[NEW]** Add the "Today's Classes" sidebar component displaying the daily schedule.
-   **[MODIFY]** Enhance the "Low Attendance Alert" section with avatar bubbles, modern progress bars, and styled badges.

### `frontend/index.css`
-   **[MODIFY]** Inject premium CSS variables, glassmorphism effects, smooth hover transitions, and specific glowing colors (purple, neon green, orange, red) to match the screenshot exactly.

### `backend/app/api/v1/faculty_dashboard.py`
-   **[MODIFY]** Create a new endpoint `/faculty-dash/attendance/stats` to calculate and return the real-time numbers for the 5 top cards.

## Verification Plan
1.  Verify the layout perfectly matches the screenshot on desktop.
2.  Test the "Mark Attendance" button to ensure the real-time database insertion still works.
3.  Ensure the "Low Attendance Alert" table populates dynamically based on real student data.
