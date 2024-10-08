package com.example.back.infracount.repository;

import com.example.back.infracount.entity.InfraCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.persistence.Tuple;
import java.util.List;

public interface InfraCountRepository extends JpaRepository<InfraCount, Long> {

    @Query("SELECT ic.infraType.name as infraTypeName, ic.infra.name as infraName, ic.count as totalCount " +
            "FROM InfraCount ic " +
            "WHERE ic.dong.dongName = :dongName ")
    List<Tuple> findInfraCountsByDongName(@Param("dongName") String dongName);

    // 동 별 인프라타입별 갯수들 집계해서 가져오기
    @Query("SELECT ic.dong.dongName as dongName, "
        + "ic.infraType.name as infraTypeName, "
        + "is_.score as infraTypeScore, "
        + "SUM(ic.count) as totalCount " +
        "FROM InfraCount as ic " +
        "JOIN InfraScore as is_ " +
        "ON ic.dong.dongId = is_.dong.dongId AND ic.infraType.typeId = is_.infraType.typeId " +
        "WHERE ic.dong.dongName = :dongName " +
        "GROUP BY ic.dong.dongId, ic.infraType.typeId")
    List<Tuple> findInfraCountByDongName(@Param("dongName") String dongName);


    // 서울시 전체 인프라타입별 갯수 평균을 가져오기
    @Query("SELECT ic.infraType.name as infraTypeName, SUM(ic.count) as totalInfraCount " +
            "FROM InfraCount ic " +
            "GROUP BY ic.infraType.name")
    List<Object[]> findTotalInfraCountByType();

}
