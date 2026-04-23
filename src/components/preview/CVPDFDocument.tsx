import React, { useMemo } from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { CVData } from '../../stores/cvStores';
import type { CVStyle } from '../../stores/cvStyleStores';
import type { Language } from '../../stores/i18nStore';

type Props = {
  data: CVData;
  styleConfig: CVStyle;
  language: Language;
};

// Map web font family to React PDF base font
const getBaseFont = (cssFont: string) => {
  if (cssFont.toLowerCase().includes('sans')) {
    return 'Helvetica';
  }
  return 'Times-Roman';
};

const fmtDate = (d: string | null | undefined, lang: Language): string => {
  if (!d) return lang === 'id' ? 'Sekarang' : 'Present';
  const [y, m] = d.split('-');
  const monthsId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = lang === 'id' ? monthsId : monthsEn;
  return `${months[parseInt(m, 10) - 1]} ${y}`;
};

const CVPDFDocument: React.FC<Props> = ({ data, styleConfig, language }) => {
  const p = data.personalInfo;
  const baseFont = getBaseFont(styleConfig.fontFamily);
  const sScale = 1 + (styleConfig.fontSizeOffset * 0.05);

  // Memoize styles per baseFont — StyleSheet.create() hanya dipanggil saat font berubah,
  // bukan setiap render (yang menjadi penyebab utama flicker/re-render cascade)
  const styles = useMemo(() => StyleSheet.create({
    page: {
      paddingTop: styleConfig.paddingY,
      paddingBottom: styleConfig.paddingY,
      paddingLeft: styleConfig.paddingX,
      paddingRight: styleConfig.paddingX,
      fontFamily: baseFont,
      color: '#1a1a1a',
      lineHeight: styleConfig.lineHeight,
      backgroundColor: '#ffffff',
    },
    header: {
      textAlign: 'center',
      marginBottom: 15,
    },
    fullName: {
      fontSize: 18 * sScale,
      fontWeight: 700,
      marginBottom: -1,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    jobTitle: {
      fontSize: 10.5 * sScale,
      color: '#444444',
      marginBottom: -1,
    },
    contactRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      lineHeight: 1,
      marginTop: -5,
    },
    contactItem: {
      fontSize: 9 * sScale,
      color: '#555555',
    },
    contactSeparator: {
      fontSize: 9 * sScale,
      color: '#999999',
      marginHorizontal: 8,
    },
    linkItem: {
      fontSize: 9 * sScale,
      color: '#2563eb',
      textDecoration: 'none',
    },
    section: {
      marginBottom: styleConfig.sectionSpacing,
    },
    sectionHeader: {
      fontSize: 10 * sScale,
      fontFamily: baseFont === 'Helvetica' ? 'Helvetica-Bold' : 'Times-Bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      borderBottomWidth: 1,
      borderBottomColor: '#1a1a1a',
      marginBottom: 4,
      width: '100%',
      paddingBottom: 1,
      lineHeight: 1,
    },
    itemContainer: {
      marginTop: 2,
      marginBottom: 4,
    },
    itemHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    },
    itemTitle: {
      fontSize: 9 * sScale,
      fontFamily: baseFont === 'Helvetica' ? 'Helvetica-Bold' : 'Times-Bold',
      lineHeight: 1.5,
    },
    itemDate: {
      fontSize: 8 * sScale,
      color: '#555555',
      lineHeight: 1.5,
    },
    itemSubtitle: {
      fontSize: 8.5 * sScale,
      fontFamily: baseFont === 'Helvetica' ? 'Helvetica-Oblique' : 'Times-Italic',
      color: '#333333',
      lineHeight: 1.5,
    },
    itemText: {
      fontSize: 9 * sScale,
      textAlign: 'justify',
      lineHeight: 1.5,
    },
    bulletList: {
      marginTop: 2,
      paddingLeft: 8,
    },
    bulletItem: {
      flexDirection: 'row',
      marginBottom: 0,
    },
    bulletPoint: {
      width: 12,
      fontSize: 8.5 * sScale,
      lineHeight: 1.2,
    },
    bulletText: {
      flex: 1,
      fontSize: 8.5 * sScale,
      lineHeight: 1.2,
    },
    smallText: {
      fontSize: 8 * sScale,
      color: '#444444',
      lineHeight: 1.2,
    },
  }), [baseFont, styleConfig, sScale]);

  const contacts = [];
  if (p.email) contacts.push(p.email);
  if (p.phone) contacts.push(p.phone);
  if (p.location) contacts.push(p.location);

  const links = [];
  if (p.linkedin) links.push(p.linkedin);
  if (p.github) links.push(p.github);
  if (p.portfolio) links.push(p.portfolio);



  const hasSkills = data.skills.some(cat => cat.items.length > 0);

  return (
    <Document title={`${p.fullName || 'CV'} - Resume`}>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.fullName}>{p.fullName || (language === 'id' ? 'Nama Lengkap' : 'Full Name')}</Text>
          <Text style={styles.jobTitle}>{p.jobTitle || (language === 'id' ? 'Posisi Pekerjaan' : 'Job Title')}</Text>
          
          <View style={styles.contactRow}>
            {contacts.map((c, i) => (
              <React.Fragment key={i}>
                <Text style={styles.contactItem}>{c}</Text>
                {i < contacts.length - 1 && <Text style={styles.contactSeparator}>|</Text>}
              </React.Fragment>
            ))}
          </View>

          {links.length > 0 && (
            <View style={styles.contactRow}>
              {links.map((url, i) => (
                <React.Fragment key={i}>
                  <Link src={url} style={styles.linkItem}>{url}</Link>
                  {i < links.length - 1 && <Text style={styles.contactSeparator}>|</Text>}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>

        {/* SUMMARY */}
        {p.summary && (
          <View wrap={false} style={styles.section}>
            <Text style={styles.sectionHeader}>{language === 'id' ? 'Ringkasan Profesional' : 'Professional Summary'}</Text>
            <Text style={styles.itemText}>{p.summary}</Text>
          </View>
        )}

        {/* WORK EXPERIENCE */}
        {data.workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{language === 'id' ? 'Pengalaman Kerja' : 'Work Experience'}</Text>
            {data.workExperience.map((w, i) => (
              <View key={i} wrap={false} style={styles.itemContainer}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{w.jobTitle}</Text>
                  <Text style={styles.itemDate}>
                    {fmtDate(w.startDate, language)} — {w.isCurrentJob ? (language === 'id' ? 'Sekarang' : 'Present') : fmtDate(w.endDate, language)}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {w.company}{w.location ? `, ${w.location}` : ''}
                </Text>
                {w.responsibilities.length > 0 && (
                  <View style={styles.bulletList}>
                    {w.responsibilities.map((r, ri) => (
                      <View key={ri} style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{r}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION */}
        {data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{language === 'id' ? 'Pendidikan' : 'Education'}</Text>
            {data.education.map((e, i) => (
              <View key={i} wrap={false} style={styles.itemContainer}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{e.degree}</Text>
                  <Text style={styles.itemDate}>
                    {fmtDate(e.startDate, language)} — {fmtDate(e.endDate, language)}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>
                  {e.institution}{e.location ? `, ${e.location}` : ''}
                </Text>
                {e.gpa && (
                  <Text style={styles.smallText}>
                    {language === 'id' ? 'IPK' : 'GPA'}: {e.gpa}{e.maxGpa ? ` / ${e.maxGpa}` : ''}
                  </Text>
                )}
                {e.relevantCoursework.length > 0 && (
                  <Text style={styles.smallText}>
                    {language === 'id' ? 'Mata Kuliah' : 'Coursework'}: {e.relevantCoursework.join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* SKILLS */}
        {hasSkills && (
          <View wrap={false} style={styles.section}>
            <Text style={styles.sectionHeader}>{language === 'id' ? 'Keahlian' : 'Skills'}</Text>
            {data.skills.map(cat => {
              if (cat.items.length > 0) {
                return (
                  <View key={cat.id} style={{ flexDirection: 'row', marginBottom: 0 }}>
                    <Text style={{ fontFamily: baseFont === 'Helvetica' ? 'Helvetica-Bold' : 'Times-Bold', fontSize: 9 * sScale, lineHeight: 1.5 }}>
                      {cat.category}: 
                    </Text>
                    <Text style={{ fontSize: 9 * sScale, marginLeft: 4, lineHeight: 1.5 }}>
                      {cat.items.join(', ')}
                    </Text>
                  </View>
                );
              }
              return null;
            })}
          </View>
        )}

        {/* PROJECTS */}
        {data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{language === 'id' ? 'Proyek' : 'Projects'}</Text>
            {data.projects.map((proj, i) => (
              <View key={i} wrap={false} style={styles.itemContainer}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{proj.name}</Text>
                  {proj.url && <Link src={proj.url} style={[styles.linkItem, { fontSize: 8 * sScale, lineHeight: 1.5 }]}>{proj.url}</Link>}
                </View>
                <Text style={styles.itemText}>{proj.description}</Text>
                {proj.techStack.length > 0 && (
                  <Text style={[styles.itemSubtitle, { fontSize: 8 * sScale, marginTop: 1 }]}>
                    Tech: {proj.techStack.join(', ')}
                  </Text>
                )}
                {proj.highlights.length > 0 && (
                  <View style={styles.bulletList}>
                    {proj.highlights.map((h, hi) => (
                      <View key={hi} style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{h}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* CERTIFICATIONS */}
        {data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{language === 'id' ? 'Sertifikasi' : 'Certifications'}</Text>
            {data.certifications.map((c, i) => (
              <View key={i} wrap={false} style={styles.itemContainer}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{c.name}</Text>
                  <Text style={styles.itemDate}>
                    {fmtDate(c.issueDate, language)}{c.expiryDate ? ` — ${fmtDate(c.expiryDate, language)}` : ''}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{c.issuer}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ORGANIZATION EXPERIENCE */}
        {data.organizationExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{language === 'id' ? 'Pengalaman Organisasi' : 'Organization Experience'}</Text>
            {data.organizationExperience.map((o, i) => (
              <View key={i} wrap={false} style={styles.itemContainer}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{o.role}</Text>
                  <Text style={styles.itemDate}>
                    {fmtDate(o.startDate, language)} — {fmtDate(o.endDate, language)}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{o.organization}</Text>
                {o.description && <Text style={[styles.itemText, { marginTop: 3 }]}>{o.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* VOLUNTEER EXPERIENCE */}
        {data.volunteerExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{language === 'id' ? 'Pengalaman Sukarelawan' : 'Volunteer Experience'}</Text>
            {data.volunteerExperience.map((v, i) => (
              <View key={i} wrap={false} style={styles.itemContainer}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{v.role}</Text>
                  <Text style={styles.itemDate}>
                    {fmtDate(v.startDate, language)} — {fmtDate(v.endDate, language)}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{v.organization}</Text>
                {v.description && <Text style={[styles.itemText, { marginTop: 3 }]}>{v.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* LANGUAGES */}
        {data.languages.length > 0 && (
          <View wrap={false} style={styles.section}>
            <Text style={styles.sectionHeader}>{language === 'id' ? 'Bahasa' : 'Languages'}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              {data.languages.map((l, i) => (
                <View key={i} style={{ flexDirection: 'row' }}>
                  <Text style={{ fontFamily: baseFont === 'Helvetica' ? 'Helvetica-Bold' : 'Times-Bold', fontSize: 8.5 * sScale }}>
                    {l.language}
                  </Text>
                  <Text style={{ fontSize: 8.5 * sScale, marginLeft: 1.5, }}>{` — ${l.proficiency}`}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* REFERENCES */}
        {data.references.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>{language === 'id' ? 'Referensi' : 'References'}</Text>
            {data.references.map((r, i) => (
              <View key={i} wrap={false} style={styles.itemContainer}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontFamily: baseFont === 'Helvetica' ? 'Helvetica-Bold' : 'Times-Bold', fontSize: 8.5 * sScale }}>
                    {r.name}
                  </Text>
                  <Text style={{ fontSize: 8.5 * sScale }}>{` — ${r.jobTitle}, ${r.company}`}</Text>
                </View>
                <Text style={{ fontSize: 8.5 * sScale, color: '#555555' }}>
                  {r.relationship} · {r.email} · {r.phone}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default CVPDFDocument;
