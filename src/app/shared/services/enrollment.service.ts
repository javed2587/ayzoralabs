import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  // ✅ NOW: Google Form embed URL
  // 🔄 LATER: Replace with → private apiUrl = 'https://your-api.railway.app/api/enrollments';
  //googleFormUrl = 'YOUR_GOOGLE_FORM_EMBED_URL';
  googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe4oy5kEhnYOSO-Ahf3GkAmt8Qz1EyDIXwfODBq0kXgSDiBTw/viewform?embedded=true';

  // 🔄 LATER (uncomment when backend ready):
  // private http = inject(HttpClient);
  // submitEnrollment(data: StudentEnrollment) {
  //   return this.http.post(this.apiUrl, data);
  // }
}
