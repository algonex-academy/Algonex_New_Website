import { Card, Tag } from "antd";

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', fontFamily: '"Outfit", "Inter", sans-serif', padding: '60px 24px' }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Tag color="cyan" style={{ marginBottom: 12, padding: "2px 12px", borderRadius: 16, textTransform: "uppercase", fontSize: 11, fontWeight: 600 }}>
            Official Policies
          </Tag>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: '#ffffff', marginBottom: 12, letterSpacing: '-0.5px' }}>
            Algonex IT Solutions
          </h1>
          <p style={{ fontSize: 20, color: '#38bdf8', fontWeight: 600, margin: '0 0 8px 0' }}>
            Student Terms & Conditions
          </p>
          <p style={{ color: "#64748b", fontSize: 14 }}>Last updated: July 2026</p>
        </div>

        {/* Card for Terms */}
        <Card style={{ 
          borderRadius: 16, 
          backgroundColor: '#1e293b', 
          borderColor: '#334155',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)' 
        }}
        bodyStyle={{ padding: '32px' }}>
          <div style={{ color: "#cbd5e1", fontSize: 15, lineHeight: 1.8 }}>
            
            <p style={{ fontSize: 16, color: '#e2e8f0', marginBottom: 24, fontWeight: 500 }}>
              Algonex IT Solutions is a hands-on Training, Internship, Fellowship, and Client Product Building platform designed for serious learners who are ready to maintain discipline, consistency, and professional behavior.
            </p>
            
            <p style={{ marginBottom: 32 }}>
              By registering for any Algonex program, the student agrees to follow all rules, attendance requirements, payment policies, conduct guidelines, confidentiality obligations, and program completion criteria.
            </p>

            <div style={{ height: '1px', backgroundColor: '#334155', margin: '24px 0' }} />

            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', marginBottom: 24 }}>
              Key Terms
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#38bdf8', marginBottom: 8 }}>
                  1. Attendance & Discipline
                </h3>
                <p>
                  Students must attend classes, reviews, project sessions, mentor meetings, and assessments regularly.
                </p>
                <p style={{ color: '#94a3b8', fontSize: 14.5 }}>
                  Absence for <strong>3 continuous classes</strong> may result in an official warning email. Absence for <strong>1 continuous week</strong> without valid communication may result in a call to the parent/guardian/emergency contact. Repeated absence, inactivity, or lack of response may lead to suspension or termination from the program without refund.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#38bdf8', marginBottom: 8 }}>
                  2. Professional Conduct
                </h3>
                <p>
                  Students must behave respectfully with trainers, mentors, staff, clients, and fellow students. Misbehaviour, abuse, harassment, threats, bullying, discrimination, fake information, disturbance in sessions, or misuse of official groups is strictly prohibited.
                </p>
                <p style={{ color: '#94a3b8', fontSize: 14.5 }}>
                  Any unusual activity, misconduct, harassment, fraud, data misuse, or illegal behavior may result in immediate termination and further action under applicable laws.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#38bdf8', marginBottom: 8 }}>
                  3. No Placement Guarantee
                </h3>
                <p>
                  Algonex IT Solutions does <strong>not</strong> provide any 100% placement guarantee, job guarantee, salary guarantee, interview guarantee, offer letter guarantee, internship-to-job guarantee, or company-selection guarantee.
                </p>
                <p style={{ color: '#94a3b8', fontSize: 14.5 }}>
                  Placement support may be provided through resume guidance, interview preparation, mock interviews, career mentoring, technical preparation, and job search support. Final selection depends completely on the student’s skills, effort, communication, performance, market conditions, and employer decisions.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#38bdf8', marginBottom: 8 }}>
                  4. No Refund Policy
                </h3>
                <p>
                  All registration fees, training fees, internship fees, fellowship fees, project fees, mentorship fees, certification fees, and other paid charges are strictly non-refundable.
                </p>
                <p style={{ color: '#94a3b8', fontSize: 14.5 }}>
                  No refund will be provided for absence, middle dropout, lack of interest, personal reasons, schedule conflicts, health reasons, internet/device issues, failure to complete assignments, termination due to misconduct, non-eligibility for certificate, or failure to get a job.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#38bdf8', marginBottom: 8 }}>
                  5. Assignments, Projects & Completion
                </h3>
                <p>
                  Students must complete all assignments, assessments, tasks, projects, reviews, and submissions within the given timelines. Certificates, internship completion, or fellowship completion will be provided only after successful completion of required criteria, including attendance, task completion, project submission, mentor approval, payment completion, and professional conduct.
                </p>
                <p style={{ color: '#38bdf8', fontWeight: 600 }}>
                  Payment alone does not guarantee a certificate.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#38bdf8', marginBottom: 8 }}>
                  6. Confidentiality & Intellectual Property
                </h3>
                <p>
                  Students may receive access to internal documents, training material, recordings, code, repositories, product ideas, project details, client-related information, and private discussions. All such information must remain confidential.
                </p>
                <p style={{ color: '#94a3b8', fontSize: 14.5 }}>
                  Students must not share, copy, upload, sell, distribute, or reuse Algonex materials, recordings, code, documents, or project content without written permission. Violation may result in termination, certificate cancellation, and legal action.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#38bdf8', marginBottom: 8 }}>
                  7. AI, Plagiarism & Cheating
                </h3>
                <p>
                  AI tools may be used only for learning, debugging, and understanding concepts if permitted by the mentor. Students must not submit copied, AI-generated, fake, or plagiarized work as their own.
                </p>
                <p style={{ color: '#94a3b8', fontSize: 14.5 }}>
                  Cheating, proxy attendance, fake submissions, copied code, fake screenshots, or inability to explain submitted work may result in immediate termination without refund.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#38bdf8', marginBottom: 8 }}>
                  8. Access Control
                </h3>
                <p>
                  Algonex may provide access to LMS, class links, recordings, repositories, groups, assignments, dashboards, and tools. Access may be restricted, paused, or removed due to non-payment, inactivity, misconduct, unauthorized sharing, program expiry, completion, or policy violation.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#38bdf8', marginBottom: 8 }}>
                  9. Legal & Final Decision
                </h3>
                <p>
                  Algonex IT Solutions reserves the right to suspend, terminate, blacklist, deny certificates, remove access, contact parents/guardians/institutions, or take legal action wherever required.
                </p>
                <p style={{ color: '#94a3b8', fontSize: 14.5 }}>
                  In all matters related to attendance, refunds, discipline, certificates, access, assessments, program completion, internship/fellowship status, and termination, the decision of Algonex IT Solutions management shall be final.
                </p>
              </div>
            </div>

            <div style={{ height: '1px', backgroundColor: '#334155', margin: '32px 0' }} />

            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', marginBottom: 16 }}>
              Student Declaration
            </h2>
            <p>
              By enrolling in Algonex IT Solutions, I confirm that I have read, understood, and agreed to the Terms & Conditions, Attendance Policy, No Refund Policy, No Placement Guarantee Policy, Code of Conduct, Confidentiality Policy, Intellectual Property Policy, and Certificate Policy.
            </p>
            <p style={{ color: '#e2e8f0', fontWeight: 500 }}>
              I understand that Algonex is built for serious learners only, and failure to maintain discipline, attendance, honesty, and professionalism may result in removal from the program without refund.
            </p>

          </div>
        </Card>
      </div>
    </div>
  );
}
