public class S360_attachment4Extractor {
    @InvocableMethod(label='S360_attachment4Extractor')
    public static List<List<Attachment>> extractAttachment(List<string> attachments) {
        System.debug('attachments');
        System.debug(attachments);
        List<List<Attachment>> result = new List<List<Attachment>>();
        
        /*for(string a : attachments){
            Map<String, Object> data = (Map<String, Object>)JSON.deserializeUntyped(a);
            Attachment s = (Attachment)Type.forName('Attachment').newInstance();
            for(string field : data.keySet()){
                if(field != 'sobjectType'){
                    s.put(field, data.get(field));
                }
            }
            result.add(s);
        }*/
        return result;
    }
}