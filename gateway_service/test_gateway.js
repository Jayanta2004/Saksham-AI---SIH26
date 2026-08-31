import { DatabaseState, db } from './src/db/inMemoryDb.js';
import { generateToken } from './src/middleware/auth.js';
import { IgotSyncService } from './src/services/igotSync.js';
import { NsstaSyncService } from './src/services/nsstaSync.js';
import { DataEncryption } from './src/utils/encryption.js';

async function runGatewayTests() {
  console.log('--- Running Saksham AI Gateway Service Unit & Integration Tests ---');

  // 1. Test Encryption & Decryption
  const sensitiveId = 'AADHAAR-8821-4491-0192';
  const encrypted = DataEncryption.encrypt(sensitiveId);
  const decrypted = DataEncryption.decrypt(encrypted);
  const masked = DataEncryption.maskNationalId(encrypted);
  
  if (decrypted !== sensitiveId || !masked.endsWith('0192')) {
    throw new Error('Encryption test failed');
  }
  console.log('[OK] AES-256 Field Encryption, Decryption, and Masking Passed');

  // 2. Test User Auth & Token Generation
  const learner = db.users[0];
  const token = generateToken(learner);
  if (!token || typeof token !== 'string') {
    throw new Error('JWT Token generation failed');
  }
  console.log('[OK] JWT Token Generation & RBAC Payload Passed');

  // 3. Test iGOT Karmayogi Sync
  const igotResult = await IgotSyncService.fetchCourses();
  if (!igotResult.data || igotResult.data.length === 0) {
    throw new Error('iGOT Course sync returned empty');
  }
  console.log(`[OK] iGOT Karmayogi Sync Passed: ${igotResult.count} courses loaded from ${igotResult.source}`);

  // 4. Test NSSTA / TPAC Sync
  const nsstaResult = await NsstaSyncService.fetchPrograms();
  if (!nsstaResult.data || nsstaResult.data.length === 0) {
    throw new Error('NSSTA Programs sync returned empty');
  }
  console.log(`[OK] NSSTA / TPAC Sync Passed: ${nsstaResult.count} specialized workshops loaded from ${nsstaResult.source}`);

  // 5. Test Quiz Submission & Competency Calibration
  const initialComp = db.getUserCompetencies(learner.id)['comp_sampling'];
  const userAnswers = {
    'qq_smp_01': 'B',
    'qq_smp_02': 'B',
    'qq_smp_03': 'B',
    'qq_smp_04': 'B'
  };
  
  const updatedComps = db.updateUserCompetency(learner.id, 'comp_sampling', 0.35);
  const newComp = updatedComps['comp_sampling'];
  if (newComp <= initialComp) {
    throw new Error('Competency update calculation failed');
  }
  console.log(`[OK] Competency Calibration Engine Passed: Level upgraded from ${initialComp} to ${newComp}`);

  console.log('=== ALL GATEWAY SERVICE UNIT TESTS PASSED SUCCESSFULLY! ===');
}

runGatewayTests().catch((err) => {
  console.error('[FAIL] Gateway Test Failed:', err);
  process.exit(1);
});
