<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function index(Request $request)
    {
        // dd($request);
        return view('admin.upload.index');
    }
    public function doUpload(Request $request)
    {
        //Kiểm tra file

    //   if ($request->hasFile('fileTest')) {
        $file = $request->filesTest;

        //Lấy Tên files
        echo 'Tên Files: ' . $file->getClientOriginalName();
        echo '<br/>';

        //Lấy Đuôi File
        echo 'Đuôi file: ' . $file->getClientOriginalExtension();
        echo '<br/>';

        //Lấy đường dẫn tạm thời của file
        echo 'Đường dẫn tạm: ' . $file->getRealPath();
        echo '<br/>';

        //Lấy kích cỡ của file đơn vị tính theo bytes
        echo 'Kích cỡ file: ' . $file->getSize();
        echo '<br/>';

        //Lấy kiểu file
        echo 'Kiểu files: ' . $file->getMimeType();
        // dd($file->getClientOriginalName());
        $file->move('saveimg', $file->getClientOriginalName());
    // }

    // dd($file->getClientOriginalName());
        return redirect()->route('upload.index')->with('success','Upload thanh cong');
    }
}
