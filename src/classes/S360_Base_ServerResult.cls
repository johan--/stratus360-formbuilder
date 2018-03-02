public class S360_Base_ServerResult {
	public static Map<String, Object> returnMessage(boolean status, List<String> messages){
        Map<String, Object> ret = new Map<String, Object>();
        ret.put('status', status);
        ret.put('messages', messages);
        
        return ret;
    }
    
    public static Map<String, Object> returnMessage(boolean status, List<String> messages, Object data){
        Map<String, Object> ret = new Map<String, Object>();
        ret.put('status', status);
        ret.put('messages', messages);
        ret.put('data', data);
        
        return ret;
    }
}