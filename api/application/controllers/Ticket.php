<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';
use Restserver\Libraries\REST_Controller;

class Ticket extends REST_Controller {
    public function __construct()
    {
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

    public function index_get()
    {
        $id = $this->get('id');
        
        if($id == ''){
            $tickets = $this->tickets->get();
        }else{
            $tickets = $this->tickets->get($id);
        }

        if (!is_null($tickets)) {
            $this->response($tickets, 200);
        } else {
            $this->response(array('error' => 'There are no data in database...'), 404);
        }
    }

    /*
    public function find_get($id)
    {
        if (!$id) {
            $this->response(null, 400);
        }
        $ticket = $this->tickets->get($id);

        if (!is_null($ticket)) {
            $this->response(array('response' => $ticket), 200);
        } else {
            $this->response(array('error' => 'Ticket Not Found...'), 404);
        }
    }
    */
    
    public function index_post()
    {
        if (!$this->post('ticket')) {
            $this->response(null, 400);
        }
        
        $id = $this->tickets->save($this->post('ticket'));
        //$this->upload_file($id);
        if (!is_null($id)) {
            $this->response(array('id' => $id), 200);
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

    public function index_delete($id) {
        if (!$id) {
            $this->response(null, 400);
        }

        $delete = $this->tickets->delete($id);

        if (!is_null($delete)) {
            $this->response(array('response' => 'Ticket Canceled!'), 200);
        } else {
            $this->response(array('error', 'Fail to cancel ticket...'), 400);
        }
    }

    function upload_file($id){
        $tahun = (new DateTime())->format('Y');
        $bulan = (new DateTime())->format('M');
        $type  = 'type';
        $path  = $_FILES['file']['name'];
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

        $new_name   = $num."_attch_".$bulan."_".$tahun."_".$id;
        $folderName = $id;
        $config['file_name']   = $new_name;
        $config['upload_path'] = './file/'.$folderName.'/'.$type.'/'.$tahun.'/'.$bulan;
        $config['allowed_types'] = 'gif|jpg|png|jpeg|bmp'; //type yang dapat diakses bisa anda sesuaikan
        $config['quality'] = '75';

        if(!is_dir('./file/'.$folderName.'/'.$type.'/'.$tahun.'/'.$bulan))
        {
            mkdir('./file/'.$folderName.'/'.$type.'/'.$tahun.'/'.$bulan, 0777,true);
        }

        $this->upload->initialize($config);

        if($this->upload->do_upload('file'))
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
            $this->tickets->simpan_upload($id,$gambar,$type);
            //$this->tickets->upload_time($id,$now);

            return TRUE;
        }
        else{
            //$this->pegawai->simpan_upload($id,'','');
            //echo $this->upload->display_errors('<p>', '</p>');
            return FALSE;
        }
    }
}