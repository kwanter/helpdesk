<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';
use Restserver\Libraries\REST_Controller;

class Upload extends REST_Controller {
    public function __construct() {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        $method = $_SERVER['REQUEST_METHOD'];
        if($method == "OPTIONS") {
            die();
        }
        parent::__construct();
        $this->load->model('ticket_model','tickets');
    }

    public function index_post() {
        if (!$this->post('ticket')) {
            $this->response(null, 400);
        }
        
        $id = $this->upload_file($file);

        if (!is_null($id)) {
            $this->response(array('response' => "ID : ".$id." Success"), 200);
        } else {
            $this->response(array('error', 'Fail to post ticket...'), 400);
        }
    }

    public function index_put() {
        if (!$this->put('ticket')) {
            $this->response("No Data Sent", 400);
        }
        
        $update = $this->tickets->update($this->put('ticket'));

        if (!is_null($update)) {
            $this->response(array('response' => 'Ticket Updated!'), 200);
        } else {
            $this->response(array('error', 'Fail to update ticket data...'.$update), 400);
        }
    }

    function upload_file($id){
        $tahun = (new DateTime())->format('Y');
        $bulan = (new DateTime())->format('M');
        $type  = 'foto';
        $path  = $_FILES['foto']['name'];
        $ext   = pathinfo($path, PATHINFO_EXTENSION);

        if($check != NULL){
            if($check->foto != NULL){
                //$temp = rtrim($check->foto,'_foto_'.$old_bulan.'_'.$old_tahun.'_'.$id);
                $temp = substr($check->foto,0,3);
                $num  = (int)$temp;
                $num += 1;
            }
        }else{
            $num = 1;
        }

        $new_name   = $num."_foto_".$bulan."_".$tahun."_".$id;
        $folderName = $id;
        $config['file_name']   = $new_name;
        $config['upload_path'] = './edok/'.$folderName.'/'.$type.'/'.$tahun.'/'.$bulan;
        $config['allowed_types'] = 'gif|jpg|png|jpeg|bmp'; //type yang dapat diakses bisa anda sesuaikan
        $config['quality'] = '75';

        if(!is_dir('./edok/'.$folderName.'/'.$type.'/'.$tahun.'/'.$bulan))
        {
            mkdir('./edok/'.$folderName.'/'.$type.'/'.$tahun.'/'.$bulan, 0777,true);
        }

        $this->upload->initialize($config);

        if($this->upload->do_upload('foto'))
        {
            $gbr     = $this->upload->data();
            $configer =  array(
                'image_library'   => 'gd2',
                'source_image'    =>  $gbr['full_path'],
                'maintain_ratio'  =>  TRUE,
                'width'           =>  1440,
                'height'          =>  1920,
            );
            $this->image_lib->clear();
            $this->image_lib->initialize($configer);
            $this->image_lib->resize();
            $gambar  = $gbr['file_name']; //Mengambil file name dari gambar yang diupload
            $type    = $gbr['image_type'];
            $now = (new DateTime())->format('Y-m-d');
            $this->pegawai->simpan_upload($id,$gambar,$type);
            $this->pegawai->upload_time($id,$now);

            return TRUE;
        }
        else{
            //$this->pegawai->simpan_upload($id,'','');
            echo $this->upload->display_errors('<p>', '</p>');
            return FALSE;
        }
    }
}