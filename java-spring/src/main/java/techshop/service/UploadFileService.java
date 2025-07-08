package techshop.service;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadFileService {

    public String handleSaveUploadFile(MultipartFile file, String targetFolder) {
        String baseDir = "E:/ecommerce/images/";
        if (file.isEmpty()) return null;
        try{
            byte[] bytes = file.getBytes();
            File dir = new File(baseDir + File.separator + targetFolder);
            if (!dir.exists())
                dir.mkdirs();

            // Create the file on server
            File serverFile = new File(dir.getAbsolutePath() + File.separator +
                    +System.currentTimeMillis() + "-" + file.getOriginalFilename());
            String nameFile = System.currentTimeMillis() + "-" + file.getOriginalFilename();
            BufferedOutputStream stream = new BufferedOutputStream(
                    new FileOutputStream(serverFile));
            stream.write(bytes);
            stream.close();

            return "/images/" + targetFolder + "/" + nameFile;
        }catch(IOException e){
            e.printStackTrace();
            return null;
        }
    }
}
