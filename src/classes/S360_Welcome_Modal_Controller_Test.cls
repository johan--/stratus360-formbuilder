@isTest
public class S360_Welcome_Modal_Controller_Test {
    @isTest
    public static void testSetDismissWelcome(){
        User testuser = new User();
        testuser.Username = 'testdgh132dhg@ocisly.com';
        testuser.LastName = 'test';
        testuser.Email = 'test@test.com';
        testuser.Alias = 'test';
        testuser.CommunityNickname = 'test';
        testuser.TimeZoneSidKey = 'America/New_York';
        testuser.LocaleSidKey = 'en_US';
        testuser.EmailEncodingKey = 'UTF-8';
        testuser.ProfileId = '00e0a000001DGlBAAW';
        testuser.LanguageLocaleKey = 'en_US';
        insert testuser;

        S360_Welcome_Modal_Controller.setDismissWelcome(testuser.Id, False);
    }

    @isTest
    public static void testGetAgreementPDFLink(){
        S360_Welcome_Modal_Controller.getAgreementPDFLink();
    }
}