import PDFDocument from "pdfkit";
import { Consultation, User } from "@shared/schema";

export async function generateConsultationPDF(
  consultation: Consultation,
  user: User
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Header with Sehha+ branding
      doc.fontSize(24)
         .fillColor("#0EA5E9")
         .text("Sehha+", 50, 50);
      
      doc.fontSize(12)
         .fillColor("#666")
         .text("Rapport de Consultation Médicale IA", 50, 80);

      // Date
      doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, 400, 80);

      // Patient Information
      doc.fontSize(16)
         .fillColor("#000")
         .text("Informations du Patient", 50, 120);

      let yPosition = 150;
      doc.fontSize(12)
         .text(`Nom: ${user.fullName}`, 50, yPosition)
         .text(`Email: ${user.email}`, 50, yPosition + 20)
         .text(`Âge: ${user.age || "Non spécifié"}`, 50, yPosition + 40)
         .text(`Genre: ${user.gender || "Non spécifié"}`, 50, yPosition + 60);

      yPosition += 100;

      // Medical History
      if (user.chronicIllnesses || user.currentMedications || user.allergies) {
        doc.fontSize(16)
           .fillColor("#000")
           .text("Historique Médical", 50, yPosition);

        yPosition += 30;
        doc.fontSize(12);

        if (user.chronicIllnesses) {
          doc.text(`Maladies chroniques: ${user.chronicIllnesses}`, 50, yPosition);
          yPosition += 20;
        }

        if (user.currentMedications) {
          doc.text(`Médicaments actuels: ${user.currentMedications}`, 50, yPosition);
          yPosition += 20;
        }

        if (user.allergies) {
          doc.text(`Allergies: ${user.allergies}`, 50, yPosition);
          yPosition += 20;
        }

        yPosition += 20;
      }

      // Symptoms
      doc.fontSize(16)
         .fillColor("#000")
         .text("Symptômes Rapportés", 50, yPosition);

      yPosition += 30;
      doc.fontSize(12)
         .text(consultation.symptoms, 50, yPosition, { width: 500 });

      yPosition += doc.heightOfString(consultation.symptoms, { width: 500 }) + 20;

      if (consultation.duration) {
        doc.text(`Durée: ${consultation.duration}`, 50, yPosition);
        yPosition += 30;
      }

      // Chat History
      if (consultation.chatMessages && Array.isArray(consultation.chatMessages) && consultation.chatMessages.length > 0) {
        // Check if we need a new page
        if (yPosition > 650) {
          doc.addPage();
          yPosition = 50;
        }

        doc.fontSize(16)
           .fillColor("#000")
           .text("Échange avec l'IA", 50, yPosition);

        yPosition += 30;
        doc.fontSize(10);

        consultation.chatMessages.forEach((message: any) => {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }

          const role = message.role === "user" ? "Patient" : "IA Sehha+";
          doc.fillColor(message.role === "user" ? "#0EA5E9" : "#10B981")
             .text(`${role}:`, 50, yPosition);
          
          yPosition += 15;
          doc.fillColor("#000")
             .text(message.content, 50, yPosition, { width: 500 });
          
          yPosition += doc.heightOfString(message.content, { width: 500 }) + 15;
        });

        yPosition += 20;
      }

      // Pre-diagnosis
      if (consultation.preDiagnosis) {
        // Check if we need a new page
        if (yPosition > 600) {
          doc.addPage();
          yPosition = 50;
        }

        doc.fontSize(16)
           .fillColor("#000")
           .text("Pré-diagnostic IA", 50, yPosition);

        yPosition += 30;
        doc.fontSize(12)
           .text(consultation.preDiagnosis, 50, yPosition, { width: 500 });

        yPosition += doc.heightOfString(consultation.preDiagnosis, { width: 500 }) + 20;
      }

      // Urgency Level
      if (consultation.urgencyLevel) {
        const urgencyColors: { [key: string]: string } = {
          low: "#10B981",
          medium: "#F59E0B",
          high: "#EF4444",
          urgent: "#DC2626"
        };

        const urgencyLabels: { [key: string]: string } = {
          low: "Faible",
          medium: "Modérée",
          high: "Élevée",
          urgent: "Urgente"
        };

        doc.fontSize(14)
           .fillColor(urgencyColors[consultation.urgencyLevel] || "#666")
           .text(`Niveau d'urgence: ${urgencyLabels[consultation.urgencyLevel] || consultation.urgencyLevel}`, 50, yPosition);

        yPosition += 30;
      }

      // Recommendations
      if (consultation.recommendations) {
        doc.fontSize(16)
           .fillColor("#000")
           .text("Recommandations", 50, yPosition);

        yPosition += 30;
        doc.fontSize(12)
           .text(consultation.recommendations, 50, yPosition, { width: 500 });

        yPosition += doc.heightOfString(consultation.recommendations, { width: 500 }) + 30;
      }

      // Medical Disclaimer
      doc.fontSize(10)
         .fillColor("#666")
         .text("IMPORTANT: Ce rapport est généré par une intelligence artificielle à des fins éducatives et ne remplace en aucun cas l'avis d'un professionnel de santé qualifié. Consultez toujours un médecin pour un diagnostic et un traitement appropriés.", 50, yPosition, { width: 500 });

      // Footer
      const footerY = doc.page.height - 100;
      doc.fontSize(10)
         .fillColor("#0EA5E9")
         .text("Sehha+ - L'IA au service de votre santé", 50, footerY)
         .text("Chez Sehha+, votre santé est notre priorité. Chaque consultation compte.", 50, footerY + 15);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
